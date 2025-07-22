import * as Y from 'yjs';
import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as map from 'lib0/map';
import { callbackHandler, isCallbackSet } from './callback';
const debounce = require('lodash.debounce');

const CALLBACK_DEBOUNCE_WAIT = parseInt(process.env['CALLBACK_DEBOUNCE_WAIT'] || '2000');
const CALLBACK_DEBOUNCE_MAXWAIT = parseInt(process.env['CALLBACK_DEBOUNCE_MAXWAIT'] || '10000');

const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;
const wsReadyStateClosing = 2;
const wsReadyStateClosed = 3;

// disable gc when using snapshots!
const gcEnabled = process.env['GC'] !== 'false' && process.env['GC'] !== '0';
const persistenceDir = process.env['YPERSISTENCE'];

interface Persistence {
  bindState: (docName: string, ydoc: WSSharedDoc) => Promise<void>;
  writeState: (docName: string, ydoc: WSSharedDoc) => Promise<any>;
  provider: any;
}

let persistence: Persistence | null = null;

if (typeof persistenceDir === 'string') {
  console.info('Persisting documents to "' + persistenceDir + '"');
  // @ts-ignore
  const LeveldbPersistence = require('y-leveldb').LeveldbPersistence;
  const ldb = new LeveldbPersistence(persistenceDir);
  persistence = {
    provider: ldb,
    bindState: async (docName: string, ydoc: WSSharedDoc) => {
      const persistedYdoc = await ldb.getYDoc(docName);
      const newUpdates = Y.encodeStateAsUpdate(ydoc);
      ldb.storeUpdate(docName, newUpdates);
      Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
      ydoc.on('update', (update: Uint8Array) => {
        ldb.storeUpdate(docName, update);
      });
    },
    writeState: async (_docName: string, _ydoc: WSSharedDoc) => {}
  };
}

export const setPersistence = (persistence_: Persistence | null): void => {
  persistence = persistence_;
};

export const getPersistence = (): Persistence | null => persistence;

export const docs: Map<string, WSSharedDoc> = new Map();

const messageSync = 0;
const messageAwareness = 1;

const updateHandler = (update: Uint8Array, _origin: any, doc: WSSharedDoc, _tr: any): void => {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);
  syncProtocol.writeUpdate(encoder, update);
  const message = encoding.toUint8Array(encoder);
  doc.conns.forEach((_, conn) => send(doc, conn, message));
};

let contentInitializor: (ydoc: Y.Doc) => Promise<void> = (_ydoc: Y.Doc) => Promise.resolve();

export const setContentInitializor = (f: (ydoc: Y.Doc) => Promise<void>): void => {
  contentInitializor = f;
};

export class WSSharedDoc extends Y.Doc {
  name: string;
  conns: Map<any, Set<number>>;
  awareness: awarenessProtocol.Awareness;
  whenInitialized: Promise<void>;

  constructor(name: string) {
    super({ gc: gcEnabled });
    this.name = name;
    this.conns = new Map();
    this.awareness = new awarenessProtocol.Awareness(this);
    this.awareness.setLocalState(null);

    const awarenessChangeHandler = ({ added, updated, removed }: { added: number[], updated: number[], removed: number[] }, conn: any): void => {
      const changedClients = added.concat(updated, removed);
      if (conn !== null) {
        const connControlledIDs = this.conns.get(conn);
        if (connControlledIDs !== undefined) {
          added.forEach(clientID => { connControlledIDs.add(clientID); });
          removed.forEach(clientID => { connControlledIDs.delete(clientID); });
        }
      }
      // broadcast awareness update
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients));
      const buff = encoding.toUint8Array(encoder);
      this.conns.forEach((_, c) => {
        send(this, c, buff);
      });
    };

    this.awareness.on('update', awarenessChangeHandler);
    this.on('update', updateHandler as any);

    if (isCallbackSet) {
      this.on('update', debounce(
        callbackHandler,
        CALLBACK_DEBOUNCE_WAIT,
        { maxWait: CALLBACK_DEBOUNCE_MAXWAIT }
      ) as any);
    }

    this.whenInitialized = contentInitializor(this);
  }
}

export const getYDoc = (docname: string, gc: boolean = true): WSSharedDoc => {
  return map.setIfUndefined(docs, docname, () => {
    const doc = new WSSharedDoc(docname);
    (doc as any).gc = gc;
    if (persistence !== null) {
      persistence.bindState(docname, doc);
    }
    // 幽灵单元格处理，暂时注释，因为 backend 接入 utils 库有些打包的问题
    // const sharedType = doc.getMap(AI_TABLE_CONTENT_FIELD_NAME) as SharedType;
    // sharedType.observeDeep((events: Array<Y.YEvent<any>>) => {
    //   const actions = applyEvents(sharedType, events);
    //   correctSharedType(sharedType, actions);
    // })
    docs.set(docname, doc);
    return doc;
  });
};

const messageListener = (conn: any, doc: WSSharedDoc, message: Uint8Array): void => {
  try {
    const encoder = encoding.createEncoder();
    const decoder = decoding.createDecoder(message);
    const messageType = decoding.readVarUint(decoder);
    switch (messageType) {
      case messageSync:
        encoding.writeVarUint(encoder, messageSync);
        syncProtocol.readSyncMessage(decoder, encoder, doc, conn);

        if (encoding.length(encoder) > 1) {
          send(doc, conn, encoding.toUint8Array(encoder));
        }
        break;
      case messageAwareness: {
        awarenessProtocol.applyAwarenessUpdate(doc.awareness, decoding.readVarUint8Array(decoder), conn);
        break;
      }
    }
  } catch (err) {
    console.error(err);
    // @ts-ignore
    doc.emit('error', [err]);
  }
};

const closeConn = (doc: WSSharedDoc, conn: any): void => {
  if (doc.conns.has(conn)) {
    const controlledIds = doc.conns.get(conn)!;
    doc.conns.delete(conn);
    awarenessProtocol.removeAwarenessStates(doc.awareness, Array.from(controlledIds), null);
    if (doc.conns.size === 0 && persistence !== null) {
      persistence.writeState(doc.name, doc).then(() => {
        doc.destroy();
      });
      docs.delete(doc.name);
    }
  }
  conn.close();
};

const send = (doc: WSSharedDoc, conn: WebSocket, message: Uint8Array): void => {
  if (conn.readyState !== wsReadyStateConnecting && conn.readyState !== wsReadyStateOpen) {
    closeConn(doc, conn);
  }
  try {
    conn.send(message, {}, (err?: Error) => { err != null && closeConn(doc, conn); });
  } catch (e) {
    closeConn(doc, conn);
  }
};

const pingTimeout = 30000;

interface SetupWSConnectionOptions {
  docName?: string;
  gc?: boolean;
}

export const setupWSConnection = (conn: WebSocket, req: IncomingMessage, { docName = req.url?.slice(1).split('?')[0] || '', gc = true }: SetupWSConnectionOptions = {}): void => {
  conn.binaryType = 'arraybuffer';
  const doc = getYDoc(docName, gc);
  doc.conns.set(conn, new Set());

  conn.on('message', (message: ArrayBuffer) => messageListener(conn, doc, new Uint8Array(message)));

  let pongReceived = true;
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      if (doc.conns.has(conn)) {
        closeConn(doc, conn);
      }
      clearInterval(pingInterval);
    } else if (doc.conns.has(conn)) {
      pongReceived = false;
      try {
        conn.ping();
      } catch (e) {
        closeConn(doc, conn);
        clearInterval(pingInterval);
      }
    }
  }, pingTimeout);

  conn.on('close', () => {
    closeConn(doc, conn);
    clearInterval(pingInterval);
  });

  conn.on('pong', () => {
    pongReceived = true;
  });

  // send sync step 1
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);
  syncProtocol.writeSyncStep1(encoder, doc);
  send(doc, conn, encoding.toUint8Array(encoder));

  const awarenessStates = doc.awareness.getStates();
  if (awarenessStates.size > 0) {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageAwareness);
    encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(doc.awareness, Array.from(awarenessStates.keys())));
    send(doc, conn, encoding.toUint8Array(encoder));
  }
};