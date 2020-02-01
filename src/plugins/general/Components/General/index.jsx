/** @jsx jsx */
import { jsx, Flex, Box } from 'theme-ui'

import Breadcrumb from '../Breadcrumb';
import ItemList from '../ItemList';
import Toolbar from '../Toolbar';
import {getConfig, getDefaultConfig} from '../../tools/config';
import DirectoryTree from '../DirectoryTree';
import icons from '../../../../assets/icons';
import {removeModal, removeSidePanel} from '../../state/actions';
import Dialog from 'rc-dialog';

export default function() {
const [state, dispatch] = window.useStore();
const defaultConfig = getDefaultConfig();
const config = getConfig();
const sidebar_components = state.general.sidebar_components;
const hasSidebarComponent = Object.keys(sidebar_components).length;
const Modal = state.general.modal;
const hasModal = !!Modal;

const closeSidebar = () => {
  dispatch(removeSidePanel());
};

  return (
    <Flex sx={{
      minHeight: '100vh'
    }}>
      <Box
        sx={{
          background: 'gray',
          flex: '0 0 auto',
          width: '272px',
          maxWidth: '272px',
          borderRight: '1px solid #ccc',
          height: 'auto'
        }}
      >
        <DirectoryTree
          state={state.general}
          dispatch={dispatch}
        />
      </Box>
      <Box
       sx={{
          flex: '1 1 auto',
        }}>

          <Toolbar
            state={state.general}
            dispatch={dispatch}
            children={defaultConfig.toolbar}
          />

          {config.toolbar ?
            <Toolbar
                state={state.general}
                dispatch={dispatch}
                children={config.toolbar}
            />
          : null}

          <Breadcrumb
              path={state.general.path}
              dispatch={dispatch}
          />

        <div>
          <ItemList
            state={state.general}
            dispatch={dispatch}
          />
        </div>
      </Box>
      {hasSidebarComponent
      ? <Box>
            <span onClick={closeSidebar}>{icons.close}</span>
        {Object.keys(sidebar_components).map(key => {
          const Component = sidebar_components[key];
          return (
                <Component key={key} id={key} state={state} dispatch={dispatch}/>
              );
        })}
      </Box>
          : null}
          <Dialog onClose={() => dispatch(removeModal())} visible={hasModal}>
            {hasModal
              ? <Modal state={state} dispatch={dispatch}/>
              : null}
          </Dialog>
    </Flex>
  );
}
