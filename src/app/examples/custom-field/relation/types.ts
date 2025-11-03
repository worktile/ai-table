import { AITableActionIconConfig, AITableImage, AITableRect, AITableText } from '@ai-table/grid';
import { AITableFieldStatTypeItemInfo, AITableReferences, AITableStatType, DEFAULT_FIELD_STAT_TYPE_MAP } from '@ai-table/utils';
import { ShapeConfig } from 'konva/lib/Shape';
import { ImageConfig } from 'konva/lib/shapes/Image';
import { RectConfig } from 'konva/lib/shapes/Rect';
import { TextConfig } from 'konva/lib/shapes/Text';
import { Dictionary } from 'ngx-tethys/types';

export enum RelationFieldType {
    relationTicket = 'relation-ticket',
    relationObjective = 'relation-objective'
}

export type RelationFieldValue = string[];

export interface RelationInfo {
    _id: string;
    title: string;
    whole_identifier?: string;
    number?: number;
    color?: string;
}

export interface AITableCustomReferences extends AITableReferences {
    [RelationFieldType.relationTicket]: Dictionary<RelationInfo>;
    [RelationFieldType.relationObjective]: Dictionary<RelationInfo>;
    svgMap?: Dictionary<string>;
}

export const RELATION_FIELD_STAT_TYPE_ITEMS: AITableFieldStatTypeItemInfo[] = [
    DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.None]!,
    DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.CountAll]!,
    DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Filled]!,
    DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.Empty]!,
    DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.PercentFilled]!,
    DEFAULT_FIELD_STAT_TYPE_MAP[AITableStatType.PercentEmpty]!
];

export const ticketIconPath =
    'M13.1585831,1.26058721 C13.6346768,1.2708997 14.1043643,1.46230596 14.4504581,1.78980596 C14.8321768,2.1427747 15.0596768,2.65355596 15.0706143,3.17324346 L15.0706143,3.22293097 L13.6437393,3.22371221 L13.6440518,8.43433722 C13.6429581,9.36308722 13.6465518,10.2919935 13.6423331,11.2205872 L13.6246377,11.2629505 L13.6184268,11.3087122 C13.5232706,12.2107435 13.0781143,13.0676185 12.4037393,13.6727747 C11.8603018,14.164806 11.1693643,14.4919935 10.4435831,14.5971497 C10.2823331,14.6220456 10.1195553,14.6329136 9.95654602,14.6365594 L2.9915518,14.637931 C2.4193643,14.6338685 1.85936429,14.354806 1.50327055,13.9082435 C1.23983305,13.5843372 1.08905181,13.1738685 1.0706143,12.757306 L1.0706143,12.6769935 L2.48170805,12.6763685 L2.48139556,5.70074347 C2.4934268,5.44011847 2.48280181,5.17918097 2.48842681,4.91855597 C2.49764555,4.52558722 2.56858305,4.13402472 2.6996768,3.76324347 C2.95186429,3.04277472 3.43233305,2.40605596 4.05264555,1.96183721 C4.65561431,1.52746222 5.3909268,1.27839972 6.1340518,1.26246221 L13.1585831,1.26058721 Z M12.443,2.461 L6.1597818,2.46218633 C5.66272303,2.47284655 5.16245141,2.64129659 4.75131645,2.93746981 C4.32941246,3.23960408 4.00191531,3.67511333 3.83104498,4.16325101 C3.76493558,4.35023268 3.72112128,4.54655771 3.70071281,4.74523996 L3.68684365,5.03758243 L3.68401182,5.64628449 L3.68139555,5.70068971 L3.681,13.437 L9.85791827,13.4378697 C9.98244779,13.4368738 10.0856677,13.431788 10.1798673,13.4215478 L10.2715154,13.4095502 C10.7592131,13.3388891 11.2301601,13.1165584 11.6022858,12.7796497 C12.0600083,12.3689084 12.3616813,11.78351 12.4214456,11.2236477 L12.4356153,11.0882961 L12.442,11.051 L12.4440066,10.7005674 L12.443,2.461 Z M10.1717543,9.29576512 C10.5031251,9.29576512 10.7717543,9.56439427 10.7717543,9.89576512 C10.7717543,10.227136 10.5031251,10.4957651 10.1717543,10.4957651 L5.77175428,10.4957651 C5.44038343,10.4957651 5.17175428,10.227136 5.17175428,9.89576512 C5.17175428,9.56439427 5.44038343,9.29576512 5.77175428,9.29576512 L10.1717543,9.29576512 Z M10.1717543,5.09576512 C10.5031251,5.09576512 10.7717543,5.36439427 10.7717543,5.69576512 C10.7717543,6.02713597 10.5031251,6.29576512 10.1717543,6.29576512 L5.77175428,6.29576512 C5.44038343,6.29576512 5.17175428,6.02713597 5.17175428,5.69576512 C5.17175428,5.36439427 5.44038343,5.09576512 5.77175428,5.09576512 L10.1717543,5.09576512 Z';

export const closeIconPath =
    'M14.2587878 2.70243866L8.90487732 8.05553902L14.2587878 13.4102597L13.4102597 14.2587878L8.05634919 8.90406716L2.70243866 14.2587878L1.85391052 13.4102597L7.20782105 8.05553902L1.85391052 2.70243866L2.70243866 1.85391052L8.05634919 7.20701088L13.4102597 1.85391052Z';

export const ticketIconSvg =
    '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" height="1em" width="1em" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="auj1.icon图标/8.rd/其他-产品支持" stroke-width="1" fill-rule="evenodd"><path fill="#f6c659"  d="M12.907 0a3.236 3.236 0 013.226 3.227v9.68a3.236 3.236 0 01-3.226 3.226h-9.68A3.236 3.236 0 010 12.907v-9.68A3.236 3.236 0 013.227 0zm-1.202 3.26c-1.673.004-3.345 0-5.018.002a2.66 2.66 0 00-1.486.5 2.687 2.687 0 00-1.118 2.111c-.004.187.004.373-.005.56v4.982H3.072v.058c.013.297.12.59.309.822.254.319.654.518 1.063.52h4.975a2.669 2.669 0 001.748-.689c.481-.432.8-1.044.867-1.688a.126.126 0 01.017-.063c.003-.663 0-1.327.002-1.99V4.663h1.019v-.036a1.4 1.4 0 00-1.366-1.366zM9.5 9a.5.5 0 010 1h-3l-.09-.008A.5.5 0 016.5 9zm0-3a.5.5 0 010 1h-3l-.09-.008A.5.5 0 016.5 6z" id="auj形状结合"></path></g></svg>';

export const closeIconSvg =
    '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fit="" height="1em" width="1em" preserveAspectRatio="xMidYMid meet" focusable="false"><g id="ahgaction/close" stroke-width="1" fill-rule="evenodd"><path d="M7.456 7.456V-.115h1.2v7.571h7.572v1.2H8.656v7.572h-1.2V8.656H-.115v-1.2h7.571z" id="ahg形状结合" transform="rotate(45 8.056 8.056)"></path></g></svg>';

export const RELATION_FIELD_DEFAULT_WIDTH = 280;

export const RELATION_FIELD_MIN_WIDTH = 245;

export const TARGET_NAME_CELL_RELATION_ADD = 'AI_TABLE_CELL_RELATION_ADD';

export const TARGET_NAME_CELL_RELATION_DELETE = 'AI_TABLE_CELL_RELATION_IDELETE';

export const TARGET_NAME_CELL_MORE_COUNT = 'AI_TABLE_CELL_MORE_COUNT';

export interface RelationMoreCountInfo {
    bgRect: AITableRect;
    text: AITableText;
}

export enum RelationOptionStyle {
    icon = 'icon',
    tag = 'tag'
}

export interface RelationConfig {
    bgRect?: AITableRect;
    tag?: {
        bgRect: AITableRect;
        text: AITableText;
    };
    icon?: Pick<AITableImage, 'x' | 'y' | 'width' | 'height' | 'url'>;
    whole_identifier?: AITableText;
    title?: AITableText;
    relationInfo?: RelationInfo;
    closeActionConfig?: AITableActionIconConfig;
}

export interface RelationKonvaConfig extends ShapeConfig {
    bgRect: RectConfig & { relationInfo: RelationInfo };
    tag?: {
        bgRect: RectConfig;
        text: TextConfig;
    };
    icon?: ImageConfig;
    closeActionConfig?: AITableActionIconConfig;
    whole_identifier?: TextConfig;
    title?: TextConfig | null;
    relationInfo: RelationInfo;
}
