import * as fileIcons from '../constants/file-icon';
import { FileIcons } from './icon';

export function getFileThumbnailName(ext: string) {
    let result = 'defaultFile';
    switch (ext) {
        case 'doc':
        case 'docx':
            result = 'doc';
            break;
        case 'ppt':
        case 'pptx':
            result = 'ppt';
            break;
        case 'xls':
        case 'xlsx':
            result = 'xls';
            break;
        case 'css':
        case 'scss':
        case 'sass':
        case 'less':
            result = 'css';
            break;
        case 'png':
        case 'jpeg':
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'svg':
            result = 'img';
            break;
        case 'mp4':
        case 'mkv':
        case 'webm':
        case 'mov':
        case 'flv':
        case '3gp':
        case 'mpv':
        case 'avi':
        case 'mpeg':
        case 'wmv':
            result = 'video';
            break;
        case 'mp3':
        case 'wma':
        case 'wav':
        case 'ape':
        case 'flac':
        case 'ogg':
        case 'm4r':
        case 'm4a':
            result = 'mp3';
            break;
        case 'pdf':
        case 'txt':
        case 'apk':
        case 'bak':
        case 'cs':
        case 'csv':
        case 'exe':
        case 'fla':
        case 'html':
        case 'ipa':
        case 'java':
        case 'js':
        case 'php':
        case 'rar':
        case 'swf':
        case 'ttf':
        case 'vss':
        case 'xsd':
        case 'zip':
        case 'youdaonote':
        case 'evernote':
        case 'yinxiang':
        case 'quip':
        case 'onenote':
        case 'onedrive':
        case 'box':
        case 'shimo':
        case 'processon':
            result = ext;
            break;
        default:
            result = 'defaultFile';
            break;
    }
    return result;
}

export function getFileThumbnailSvgString(ext: string) {
    let result = 'defaultFile';
    switch (ext) {
        case 'doc':
        case 'docx':
            result = fileIcons.doc;
            break;
        case 'ppt':
        case 'pptx':
            result = fileIcons.ppt;
            break;
        case 'xls':
        case 'xlsx':
            result = fileIcons.xls;
            break;
        case 'css':
        case 'scss':
        case 'sass':
        case 'less':
            result = fileIcons.css;
            break;
        case 'png':
        case 'jpeg':
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'svg':
            result = fileIcons.img;
            break;
        case 'mp4':
        case 'mkv':
        case 'webm':
        case 'mov':
        case 'flv':
        case '3gp':
        case 'mpv':
        case 'avi':
        case 'mpeg':
        case 'wmv':
            result = fileIcons.video;
            break;
        case 'mp3':
        case 'wma':
        case 'wav':
        case 'ape':
        case 'flac':
        case 'ogg':
        case 'm4r':
        case 'm4a':
            result = fileIcons.mp3;
            break;
        case 'pdf':
            result = fileIcons.pdf;
            break;
        case 'txt':
            result = fileIcons.txt;
            break;
        case 'apk':
            result = fileIcons.apk;
            break;
        case 'bak':
            result = fileIcons.apk;
            break;
        case 'cs':
            result = fileIcons.cs;
            break;
        case 'csv':
            result = fileIcons.csv;
            break;
        case 'exe':
            result = fileIcons.exe;
            break;
        case 'fla':
            result = fileIcons.fla;
            break;
        case 'html':
            result = fileIcons.html;
            break;
        case 'ipa':
            result = fileIcons.ipa;
            break;
        case 'java':
            result = fileIcons.java;
            break;
        case 'js':
            result = fileIcons.js;
            break;
        case 'php':
            result = fileIcons.php;
            break;
        case 'rar':
            result = fileIcons.rar;
            break;
        case 'swf':
            result = fileIcons.swf;
            break;
        case 'ttf':
            result = fileIcons.ttf;
            break;
        case 'vss':
            result = fileIcons.vss;
            break;
        case 'xsd':
            result = fileIcons.xsd;
            break;
        case 'zip':
            result = fileIcons.zip;
            break;
        default:
            result = fileIcons.defaultFile;
            break;
    }
    return result;
}

export function getFileCanvasPaths(ext: string) {
    const fileThumbnailName = getFileThumbnailName(ext);
    return FileIcons[fileThumbnailName];
}
