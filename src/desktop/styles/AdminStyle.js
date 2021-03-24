import { createUseStyles } from 'react-jss';
import background from '../images/Background.png';

const AdminStyle = createUseStyles({
    rootBox: {
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100%',
        overflow: 'auto',
    },
});

export default AdminStyle;
