import React from 'react';
import { StyledCard, CardHeader, CardBody, CardFooter, StyledCardProps } from './styled';

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, StyledCardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  Body: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  Footer: React.FC<React.HTMLAttributes<HTMLDivElement>>;
} = ({ children, $glow = false, $interactive = false, $glass = false, ...props }) => {
  return (
    <StyledCard $glow={$glow} $interactive={$interactive} $glass={$glass} {...props}>
      {children}
    </StyledCard>
  );
};

Card.Header = ({ children, ...props }) => {
  return <CardHeader {...props}>{children}</CardHeader>;
};
Card.Header.displayName = 'Card.Header';

Card.Body = ({ children, ...props }) => {
  return <CardBody {...props}>{children}</CardBody>;
};
Card.Body.displayName = 'Card.Body';

Card.Footer = ({ children, ...props }) => {
  return <CardFooter {...props}>{children}</CardFooter>;
};
Card.Footer.displayName = 'Card.Footer';

export default Card;
