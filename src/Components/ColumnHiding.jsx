import React from "react";
import { useMemo } from "react";
import { COLUMNS } from "./Columns";
import MOCK_DATA from "./MOCK_DATA.json";
import { useTable } from "react-table";
import "./Table.css";
import { Checkbox } from "./Checkbox";

const ColumnHiding = () => {
  const columns = useMemo(() => COLUMNS, []); // <--- This line is the key to the solution
  const data = useMemo(() => MOCK_DATA, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    allColumns,
    getToggleHideAllColumnsProps,
  } = useTable({
    columns,
    data,
  });

  return (
    <>
    <div>
        <div>
            <Checkbox {...getToggleHideAllColumnsProps()} /> Toggle All
        </div>
        {
            allColumns.map((column)=>(
                <div key={column.id}>
                    <label>
                        <input type="checkbox" {...column.getToggleHiddenProps()} />
                        {column.Header}
                    </label>
                </div>
            ))
        }
    </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key, ...restProps } = headerGroup.getHeaderGroupProps();
            return(
            <tr key={key} {...restProps}>
              {headerGroup.headers.map((column) => {
                const { key, ...restProps } = column.getHeaderProps();
                return(
                <th key={key} {...restProps}>
                  {column.render("Header")}
                </th>
                )
              })}
            </tr>
            )
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            const { key, ...restProps } = row.getRowProps();
            return (
              <tr key={key} {...restProps}>
                {row.cells.map((cell) => {
                  const { key, ...restProps } = cell.getCellProps(); // Destructure the key
                  return (
                    <td key={key} {...restProps}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default ColumnHiding;
