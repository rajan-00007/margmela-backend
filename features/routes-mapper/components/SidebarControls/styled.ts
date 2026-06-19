import styled from 'styled-components';

export const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const TabsHeader = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-bottom: 12px;
  gap: 6px;
`;

interface TabButtonProps {
  $active: boolean;
}

export const TabButton = styled.button<TabButtonProps>`
  flex: 1;
  padding: 8px 4px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  border: 1px solid transparent;
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};

  ${props => props.$active && `
    background: ${props.theme.colors.surface};
    border-color: ${props.theme.colors.border};
    color: #22d3ee;
    box-shadow: inset 0 1px 2px rgba(255,255,255,0.05);
  `}

  &:hover {
    color: ${props => props.$active ? '#22d3ee' : props.theme.colors.textPrimary};
  }
`;

export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 16px;
`;

export const EmptyPanelState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 48px 0;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 13px;

  .subtitle {
    font-size: 11px;
    color: ${props => props.theme.colors.textMuted};
    margin-top: 4px;
    max-width: 200px;
  }
`;

export const ListScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 480px;
  overflow-y: auto;
  padding-right: 4px;

  @media (max-width: ${props => props.theme.breakpoints.laptop}) {
    max-height: 320px;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 2px;
  }
`;

interface ItemRowCardProps {
  $isSelected: boolean;
}

export const ItemRowCard = styled.div<ItemRowCardProps>`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${props => props.$isSelected ? '#eab308' : props.theme.colors.border};
  background: rgba(9, 9, 11, 0.4);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all ${props => props.theme.transitions.fast};

  ${props => props.$isSelected && `
    background: rgba(234, 179, 8, 0.03);
    box-shadow: 0 0 10px rgba(234,179,8,0.05);
  `}

  &:hover {
    border-color: ${props => props.$isSelected ? '#eab308' : props.theme.colors.textMuted};
  }
`;

export const DeleteIconButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textMuted};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    color: ${props => props.theme.colors.danger};
    background: rgba(239, 68, 68, 0.05);
  }
`;

interface IndexBadgeProps {
  $selected: boolean;
}

export const IndexBadge = styled.span<IndexBadgeProps>`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  font-family: ${props => props.theme.typography.families.mono};
  border: 1px solid;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  ${props => props.$selected ? `
    background: rgba(234, 179, 8, 0.15);
    border-color: #eab308;
    color: #eab308;
  ` : `
    background: rgba(255,255,255,0.03);
    border-color: ${props.theme.colors.border};
    color: ${props.theme.colors.textSecondary};
  `}
`;

export const NodeNameInput = styled.input`
  background: transparent;
  border: none;
  border-bottom: 1px dashed rgba(255,255,255,0.1);
  color: ${props => props.theme.colors.textPrimary};
  font-size: 12px;
  font-weight: 700;
  padding: 2px 4px;
  max-width: 140px;
  outline: none;
  transition: all ${props => props.theme.transitions.fast};

  &:focus {
    border-bottom-color: ${props => props.theme.colors.textSecondary};
  }
`;

export const EntranceLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  user-select: none;
`;

export const PoiAnchorBadge = styled.span`
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(6, 182, 212, 0.08);
  border: 1px solid rgba(6, 182, 212, 0.2);
  color: #22d3ee;
  width: max-content;
`;

export const CoordinatesFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  font-size: 9px;
  font-family: ${props => props.theme.typography.families.mono};
  color: ${props => props.theme.colors.textMuted};
  border-top: 1px solid rgba(255,255,255,0.02);
  padding-top: 4px;
`;

export const QuickConnectContainer = styled.div`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  background: rgba(9, 9, 11, 0.6);
  display: flex;
  flex-direction: column;
  gap: 10px;

  .title {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: ${props => props.theme.colors.textSecondary};
  }

  .select-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  .quick-select {
    width: 100%;
    background: #18181b;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 11px;
    color: ${props => props.theme.colors.textPrimary};
    outline: none;
    cursor: pointer;
  }
`;

export const EdgeItemRow = styled.div`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  background: rgba(9, 9, 11, 0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .connection-text {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
  }

  .idx {
    font-size: 9px;
    font-family: ${props => props.theme.typography.families.mono};
    background: ${props => props.theme.colors.surface};
    border: 1px solid ${props => props.theme.colors.border};
    padding: 2px 6px;
    border-radius: 6px;
    color: ${props => props.theme.colors.textSecondary};
  }

  .name {
    font-weight: 700;
    color: ${props => props.theme.colors.textPrimary};
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .arrows {
    color: ${props => props.theme.colors.textMuted};
  }
`;

export const PoiCard = styled.div`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  background: rgba(9, 9, 11, 0.4);
  display: flex;
  flex-direction: column;
  gap: 10px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }

  .name-titles {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .en {
    font-size: 12px;
    font-weight: 700;
    color: ${props => props.theme.colors.textPrimary};
  }

  .translated {
    font-size: 9px;
    color: ${props => props.theme.colors.textMuted};
  }

  .actions {
    display: flex;
    gap: 4px;
  }

  .desc {
    font-size: 10px;
    color: ${props => props.theme.colors.textSecondary};
    font-style: italic;
    background: rgba(255,255,255,0.02);
    padding: 6px 8px;
    border: 1px solid rgba(255,255,255,0.03);
    border-radius: 6px;
    margin: 0;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9px;
    border-top: 1px solid rgba(255,255,255,0.02);
    padding-top: 8px;
  }

  .category {
    font-weight: 700;
  }

  .coords {
    color: ${props => props.theme.colors.textMuted};
    font-family: ${props => props.theme.typography.families.mono};
  }
`;

export const ActionBtn = styled.button`
  padding: 4px 6px;
  border-radius: 6px;
  background: #18181b;
  border: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  font-size: 10px;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.surface};
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormTitle = styled.h3`
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  color: #22d3ee;
  margin: 0;
`;

export const CancelTextLink = styled.button`
  background: transparent;
  border: none;
  font-size: 10px;
  font-weight: 700;
  color: ${props => props.theme.colors.textMuted};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};

  &:hover {
    color: ${props => props.theme.colors.textPrimary};
  }
`;

export const FormGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

export const LabelText = styled.label`
  font-size: 10px;
  font-weight: 700;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const CategorySelect = styled.select`
  width: 100%;
  background: #18181b;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 10px;
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
  outline: none;
  cursor: pointer;
`;

export const TextArea = styled.textarea`
  width: 100%;
  background: #18181b;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 10px;
  font-size: 12px;
  color: ${props => props.theme.colors.textPrimary};
  outline: none;
  resize: none;
  font-family: inherit;
  line-height: 1.5;
`;

export const CoordinatesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }

  .box {
    background: rgba(9, 9, 11, 0.4);
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 8px;
    padding: 8px;
    display: flex;
    flex-direction: column;
  }

  .lbl {
    font-size: 8px;
    color: ${props => props.theme.colors.textMuted};
    text-transform: uppercase;
  }

  .val {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.theme.colors.textSecondary};
    font-family: ${props => props.theme.typography.families.mono};
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const FormBannerTip = styled.p`
  margin: 4px 0 0 0;
  font-size: 9px;
  line-height: 1.4;
  color: #22d3ee;
  background: rgba(6, 182, 212, 0.06);
  border: 1px solid rgba(6, 182, 212, 0.15);
  padding: 8px;
  border-radius: 8px;
  font-weight: 500;
`;
