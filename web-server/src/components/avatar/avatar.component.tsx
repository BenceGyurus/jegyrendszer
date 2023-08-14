import Avatar from '@mui/material/Avatar';

type typeOfStringAvatarParams = {
    username : string,
    width? : number,
    height? : number
}

const StringAvatar = ({username, width, height}:typeOfStringAvatarParams)=>{
    const stringToColor = (string: string)=> {
        let hash = 0;
        let i;
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
      
        return color;
      }      

    const stringAvatar = (name: string) => {
        return {
          sx: {
            bgcolor: stringToColor(name),
            width : width ? width : 30, 
            height: height ? height : 30
          },
          children: name ? name.split(" ").length == 1 ? `${name.split(' ')[0][0].toUpperCase()}` : `${name.split(' ')[0][0].toUpperCase()}${name.split(' ')[1][0].toUpperCase()}` : "A",
        };
      }

    return (
        <Avatar {...stringAvatar(username)} />
    );
}

export default StringAvatar;