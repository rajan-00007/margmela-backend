import React from 'react';
import { TableWrapper, StyledTable, THead, TH, TR, TD } from './styled';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> & {
  Row: React.FC<React.HTMLAttributes<HTMLTableRowElement>>;
  Cell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>>;
} = ({ headers, children, ...props }) => {
  return (
    <TableWrapper>
      <StyledTable {...props}>
        <THead>
          <tr>
            {headers.map((header, idx) => (
              <TH key={idx}>{header}</TH>
            ))}
          </tr>
        </THead>
        <tbody>{children}</tbody>
      </StyledTable>
    </TableWrapper>
  );
};

Table.Row = ({ children, ...props }) => {
  return <TR {...props}>{children}</TR>;
};
Table.Row.displayName = 'Table.Row';

Table.Cell = ({ children, ...props }) => {
  return <TD {...props}>{children}</TD>;
};
Table.Cell.displayName = 'Table.Cell';

export default Table;
