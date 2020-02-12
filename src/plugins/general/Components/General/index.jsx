/** @jsx jsx */
import {jsx, Box, Flex} from 'theme-ui';
import styled from '@emotion/styled';
import ItemList from './ItemList';
import Toolbar from '../Toolbar';
import {getConfig, getDefaultConfig} from '../../tools/config';
import DirectoryTree from './DirectoryTree';
import icons from '../../../../assets/icons';
import {removeModal, removeSidePanel} from '../../state/actions';
import {SkyLightStateless} from 'react-skylight';
import ContextMenu from '../ContextMenu';
import {SmoothScroll} from '../../../../helpers/Utils';

export default function() {
  const [state, dispatch] = window.useStore();
  const defaultConfig = getDefaultConfig();
  const config = getConfig();
  const sidebar_components = state.general.sidebar_components;
  const hasSidebarComponent = Object.keys(sidebar_components).length;
  const Modal = state.general.modal;
  const hasModal = !!Modal;
  const InjectedComponent = state.general.injected_component;
  const hasInjectedComponent = !!InjectedComponent;

  const goToTop = () => SmoothScroll.scrollTo('fm-header');

  const closeSidebar = () => {
    dispatch(removeSidePanel());
  };

  return (
      <Box>
        <header id="fm-header" sx={{ background: 'lightGray', position: 'sticky', top: 0, left: 0, right: 0, width: '100%', height: '100%', zIndex: '9' }}>
          <Flex
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #ddd',
              p: 2,
            }}>
            <Flex>
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
            </Flex>

            <Flex>
              <div>
                {
                defaultConfig.utility ?
                  <Toolbar
                    state={state.general}
                    dispatch={dispatch}
                    children={defaultConfig.utility}/>
                  : null
                }
              </div>
              <div>
                {
                  defaultConfig.search ?
                    <Toolbar
                      state={state.general}
                      dispatch={dispatch}
                      children={defaultConfig.search}/> : null
                }
              </div>
            </Flex>
          </Flex>
        </header>
        
        <Flex bg="white" sx={{ width: '100%'}}>
          <aside
            sx={{
              flexGrow: 1,
              flexBasis: 'sidebar',
              background: 'gray',
              borderRight: '1px solid #ddd',
              height: '100vh',
              width: 'sidebar',
              overflow: 'auto'
            }}>

            <DirectoryTree state={state.general} dispatch={dispatch}/>

            <Flex sx={{
              position: 'fixed',
              justifyContent: 'space-between',
              bottom: 0,
              width: 'sidebar',
              background: '#f5f5f5',
              borderTop: '1px solid #ddd',
              borderRight: '1px solid #ddd',
              py: 2,
              px: 3,

              '*': {
                fontSize: 12,
                color: 'gray',
                textTransform: 'uppercase',
              },
              'svg': {
                widht: '12px', height: '12px',
              },
            }}>
              <Link href="#!" onClick={goToTop}>
                {icons.arrow_up} Back To Top
              </Link>
              <Link href="https://www.themexpert.com" target="_blank">
                {icons.info} ThemeXpert
              </Link>
            </Flex>

          </aside>
          <main
            sx={{
              flexGrow: 99999,
              flexBasis: 0,
              height: '100vh',
              overflow: 'scroll'
          }}>
            <ItemList state={state.general} dispatch={dispatch}/>

            {hasSidebarComponent
                ? <Box>
                  <span onClick={closeSidebar}>{icons.close}</span>
                  {Object.keys(sidebar_components).map(key => {
                    const Component = sidebar_components[key];
                    return (
                        <Component key={key} id={key} state={state}
                                  dispatch={dispatch}/>
                    );
                  })}
                </Box>
                : null}
          </main>
        </Flex>
        
        <SkyLightStateless
            afterClose={() => dispatch(removeModal())}
            closeOnEsc
            isVisible={hasModal}
            onCloseClicked={() => dispatch(removeModal())}
            dialogStyles={ModalDialogStyle}
        >
          {hasModal
              ? <Modal state={state} dispatch={dispatch}/>
              : null}
        </SkyLightStateless>
        {hasInjectedComponent
            ? <InjectedComponent state={state} dispatch={dispatch}/>
            : null}
        <ContextMenu/>
      </Box>

  );
}

const ModalDialogStyle = {
  minHeight: '200px',
};
const Link = styled.a`
  text-decoration: none;
`;