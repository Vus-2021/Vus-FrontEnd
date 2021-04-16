import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
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
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';

const editorConfiguration = {
    plugins: [
        Essentials,
        Paragraph,
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
        TextTransformation,
    ],
    toolbar: [
        'paragraph',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'font',
        'fontColor',
        'fontSize',
        '|',
        'BlockQuote',
        'Alignment',
        'insertTable',
        '|',
        'undo',
        'redo',
    ],
    fontSize: {
        options: [9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 24],
    },
    alignment: {
        options: ['justify', 'left', 'center', 'right'],
    },
    table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
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
