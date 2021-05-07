import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Font from '@ckeditor/ckeditor5-font/src/font';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import List from '@ckeditor/ckeditor5-list/src/list';
import ToDoList from '@ckeditor/ckeditor5-list/src/todolist';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import Image from '@ckeditor/ckeditor5-image/src/image';
import Link from '@ckeditor/ckeditor5-link/src/link';
import CKFinderUploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';

const editorConfiguration = {
    plugins: [
        Essentials,
        Paragraph,
        Heading,
        Bold,
        Italic,
        Underline,
        Strikethrough,
        BlockQuote,
        Font,
        FontColor,
        FontSize,
        Alignment,
        Table,
        TableToolbar,
        TableCellProperties,
        TableProperties,
        TextTransformation,
        List,
        ToDoList,
        Indent,
        CKFinder,
        Image,
        Link,
        CKFinderUploadAdapter,
        ImageUpload,
        ImageResize,
    ],
    toolbar: {
        items: [
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            '|',
            'bulletedList',
            'numberedList',
            'todoList',
            'indent',
            'outdent',
            'fontColor',
            'fontSize',
            'fontBackgroundColor',
            '|',
            'BlockQuote',
            'Alignment',
            'insertTable',
            'imageUpload',
            '|',
            'undo',
            'redo',
        ],
        shouldNotGroupWhenFull: true,
    },

    fontSize: {
        options: [10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32],
    },
    alignment: {
        options: ['justify', 'left', 'center', 'right'],
    },
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'tableProperties',
            'tableCellProperties',
        ],
    },
    ckfinder: {
        uploadUrl: 'https://tz6nuyyauc.execute-api.ap-northeast-2.amazonaws.com/dev/image/',
        resourceType: 'Images',
    },
    typing: {
        transformations: {
            remove: [
                'enDash',
                'emDash',
                'oneHalf',
                'oneThird',
                'twoThirds',
                'oneForth',
                'threeQuarters',
            ],
        },
    },
    placeholder: '내용을 입력해주세요.',
};

export default editorConfiguration;
