import React from "react";
import { useMemo } from "react";
import { COLUMNS } from "./Columns";
import MOCK_DATA from "./MOCK_DATA.json";
import { useTable,useRowSelect } from "react-table";
import "./Table.css";
import { Checkbox } from "./Checkbox";


const RowSelection = () => {
  const columns = useMemo(() => COLUMNS, []); // <--- This line is the key to the solution
  const data = useMemo(() => MOCK_DATA, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow,selectedFlatRows } =
    useTable(
      {
        columns,
        data,
      },
      useRowSelect,
      (hooks)=>{
        hooks.visibleColumns.push((columns)=>{
            return [
                {
                    id: 'selection',
                    Header: ({getToggleAllRowsSelectedProps}) =>(
                        <Checkbox {...getToggleAllRowsSelectedProps()} />
                    ),
                    Cell:({row})=>(
                        <Checkbox {...row.getToggleRowSelectedProps()} />
                    )
                },
                ...columns
            ]
        })
      }
    );

  const firstPageRows = rows.slice(0,10)

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key, ...restProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...restProps}>
                {headerGroup.headers.map((column) => {
                  const { key, ...restProps } = column.getHeaderProps();
                  return (
                    <th key={key} {...restProps}>
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row) => {
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
      <pre>
        <code>
          {JSON.stringify(
            {
              selectedFlatRows: selectedFlatRows.map((row) => row.original),
            },
            null,
            2
          )}
        </code>
      </pre>
    </>
  );
};

export default RowSelection;
