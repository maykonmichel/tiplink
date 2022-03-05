import Box from '@mui/material/Box';
import ActionsPanelTitleBar from './ActionsPanelTitleBar';

type Props = {
  titleBarVisible: boolean,
  title: string,
  backOnClick: () => void,
}

const ActionsPanel: React.FC<Props> = ({titleBarVisible, title, backOnClick}) => {
  return (
    <Box width='100%'>
      {titleBarVisible 
        ? <ActionsPanelTitleBar title={title} backOnClick={backOnClick}/>
        : null}
    </Box>
  );
};

export default ActionsPanel;