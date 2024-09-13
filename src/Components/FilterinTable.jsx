import React from "react";
import { useMemo } from "react";
import { COLUMNS } from "./Columns";
import MOCK_DATA from "./MOCK_DATA.json";
import { useTable,useGlobalFilter,useFilters } from "react-table";
import "./Table.css";
import GlobalFilter from "./GlobalFilter";
import ColumnFilter from "./ColumnFilter";

const FilteringTable = () => {
  const columns = useMemo(() => COLUMNS, []); // <--- This line is the key to the solution
  const data = useMemo(() => MOCK_DATA, []);
  const defaultColumn = useMemo(()=>{
    return{
        Filter:ColumnFilter
    }
  },[])

  const { 
    getTableProps, 
    getTableBodyProps, 
    headerGroups, 
    rows,
    prepareRow,
    state,
    setGlobalFilter
    } = useTable({
    columns,
    data,
    defaultColumn
  },
  useFilters,
  useGlobalFilter);

  const{globalFilter}=state
  return (
    <>
    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
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
                  <div>{column.canFilter ? column.render('Filter'):null}</div>
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

export default FilteringTable;
