import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { Layout, Menu, Icon } from 'antd';
import Logo from '../../components/Logo';

const { Sider: AntSider } = Layout;

@observer
class Sider extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <Layout css="height: 100%;">
        <AntSider
          css={`
            background: #ffffff;
            width: 64px;
            height: 100%;

            .ant-menu-inline-collapsed {
              width: 65px;

              .ant-menu-item {
                padding: 0 24px !important;
              }
            }
          `}
          breakpoint="lg"
          collapsedWidth="64px"
          collapsible
        >
          <Logo />
          <Menu mode="inline" defaultSelectedKeys={['4']}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span className="nav-text">nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span className="nav-text">nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span className="nav-text">nav 3</span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="user" />
              <span className="nav-text">nav 4</span>
            </Menu.Item>
          </Menu>
        </AntSider>
        <Layout>{this.props.children}</Layout>
      </Layout>
    );
  }
}

export default Sider;
