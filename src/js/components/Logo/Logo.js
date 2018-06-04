import React from 'react';
import styled from 'react-emotion';

const LogoContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
`;

const Logo = props => <LogoContainer {...props}>Logo</LogoContainer>;

export default Logo;
