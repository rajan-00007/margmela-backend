import styled from 'styled-components';

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background-color: ${props => props.theme.colors.surface};
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-family: ${props => props.theme.typography.families.sans};
  font-size: ${props => props.theme.typography.sizes.sm};
`;

export const THead = styled.thead`
  background-color: rgba(9, 9, 11, 0.4);
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  font-weight: ${props => props.theme.typography.weights.semibold};
  text-transform: uppercase;
  font-size: ${props => props.theme.typography.sizes.xs};
  letter-spacing: 0.05em;
`;

export const TH = styled.th`
  padding: 14px 20px;
`;

export const TR = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: all ${props => props.theme.transitions.fast};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.surfaceHover};
  }
`;

export const TD = styled.td`
  padding: 14px 20px;
  color: ${props => props.theme.colors.textPrimary};
  vertical-align: middle;
`;
