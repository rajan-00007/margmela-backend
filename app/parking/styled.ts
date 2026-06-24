import styled, { css, keyframes } from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
  min-height: calc(100vh - 80px);
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

export const HeaderTitles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PageTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

export const PageSubtitle = styled.p`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary || '#a1a1aa'};
  margin: 0;
  line-height: 1.5;
`;

export const WorkspaceLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const LotsListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const MapPlaceholder = styled.div`
  height: 250px;
  background: #09090b;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border || 'rgba(255, 255, 255, 0.08)'};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

export const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
  
  .leaflet-container {
    background-color: #09090b !important;
  }
`;

export const FormCard = styled.div`
  background: rgba(20, 20, 23, 0.6);
  border: 1px solid ${props => props.theme.colors.border || 'rgba(255, 255, 255, 0.08)'};
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(12px);
`;

export const SectionHeader = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  svg {
    color: #f97316;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: #a1a1aa;
`;

export const TextArea = styled.textarea`
  width: 100%;
  background: rgba(9, 9, 11, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px 12px;
  color: #fff;
  font-size: 13px;
  transition: all 0.2s;
  resize: none;

  &:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 8px rgba(249, 115, 22, 0.15);
  }
`;

export const InfoTip = styled.div`
  font-size: 11px;
  color: #a1a1aa;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(249, 115, 22, 0.05);
  border: 1px solid rgba(249, 115, 22, 0.15);
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 4px;
`;

export const LotsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const LotCard = styled.div<{ $isActive: boolean }>`
  background: rgba(20, 20, 23, 0.4);
  border: 1px solid ${props => props.$isActive ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(249, 115, 22, 0.4);
    background: rgba(20, 20, 23, 0.6);
  }
`;

export const LotHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const LotTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0;
`;

export const Badge = styled.span<{ $variant?: 'primary' | 'danger' | 'success' | 'secondary' }>`
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return css`
          background: rgba(249, 115, 22, 0.15);
          color: #f97316;
          border: 1px solid rgba(249, 115, 22, 0.25);
        `;
      case 'danger':
        return css`
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.25);
        `;
      case 'success':
        return css`
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.25);
        `;
      default:
        return css`
          background: rgba(255, 255, 255, 0.05);
          color: #a1a1aa;
          border: 1px solid rgba(255, 255, 255, 0.1);
        `;
    }
  }}
`;

export const LotMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  padding: 10px;
  background: rgba(9, 9, 11, 0.4);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.03);
`;

export const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11px;
  color: #71717a;

  span {
    color: #e4e4e7;
    font-weight: 600;
  }
`;

export const LotActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
`;

export const ActionButton = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  
  background: ${props => props.$danger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.$danger ? '#f87171' : '#a1a1aa'};
  border: 1px solid ${props => props.$danger ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)'};

  &:hover {
    background: ${props => props.$danger ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
    color: ${props => props.$danger ? '#ef4444' : '#fff'};
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: rgba(20, 20, 23, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #71717a;
  text-align: center;
  gap: 12px;

  h4 {
    color: #fff;
    margin: 0;
  }
`;

export const AlertBanner = styled.div<{ $type?: 'info' | 'warning' }>`
  background: ${props => props.$type === 'warning' ? 'rgba(245, 158, 11, 0.05)' : 'rgba(59, 130, 246, 0.05)'};
  border: 1px solid ${props => props.$type === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)'};
  border-radius: 12px;
  padding: 14px 18px;
  font-size: 13px;
  color: ${props => props.$type === 'warning' ? '#fcd34d' : '#93c5fd'};
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
`;
