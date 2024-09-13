import React, { useState } from "react";
import { useMemo } from "react";
import { COLUMNS } from "./Columns";
import MOCK_DATA from "./MOCK_DATA.json";
import { useFilters, useGlobalFilter, usePagination, useTable } from "react-table";
import "./Table.css";
import GlobalFilter from "./GlobalFilter";
import ColumnFilter from "./ColumnFilter";
import './CrudTable.css'
import { format } from "date-fns";

const CrudTable = () => {
  const columns = useMemo(() => COLUMNS, []); // <--- This line is the key to the solution
  // const data = useMemo(() => MOCK_DATA, []);

  const[data,setData] =useState(MOCK_DATA)
  const [newRow,setNewRow] =useState({})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Editing mode
  const [currentRow, setCurrentRow] = useState(null); // Row being edited or added

  const defaultColumn = useMemo(()=>{
    return{
        Filter:ColumnFilter
    }
  },[])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setGlobalFilter,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize
  } = useTable(
    {
      columns,
      data,
      defaultColumn
    },
    useFilters,
    useGlobalFilter,
    usePagination
  );

  const{globalFilter,pageIndex,pageSize}=state

  const handleOpenModal = (row=null) => {
    setIsModalOpen(true);
    if (row) {
      setNewRow(row.original); // Load existing data into form for editing
      setIsEditing(true);
      setCurrentRow(row);
    } else {
      setNewRow({}); // Reset the form for new entry
      setIsEditing(false);
    }
  };
   // Close the modal
   const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewRow({}); // Reset form fields when closing
    setIsEditing(false)
  };
  // Handle input changes for new row in the modal
  const handleInputChange = (e, columnId) => {
    setNewRow({
      ...newRow,
      [columnId]: e.target.value, // Update specific column value
    });
  };
   // Automatically generate the new ID and add the row to the table
  const handleSubmit = () => {
    if (isEditing && currentRow) {
      // Edit existing row
      const updatedData = data.map((row) =>
        row.id === currentRow.original.id ? { ...newRow } : row
      );
      setData(updatedData);
    }
    else{
      const lastId = data.length > 0 ? data[data.length - 1].id : 0; // Get the last row's ID
      const newId = lastId + 1; // Increment ID by 1
      const formattedDateOfBirth = newRow.date_of_birth
          ? format(new Date(newRow.date_of_birth), "dd-MM-yyyy")
          : "";
      const rowWithId = { id: newId, ...newRow,  date_of_birth: formattedDateOfBirth }; // Add the new ID to the row
      setData([...data, rowWithId]); // Add new row to the table data
    }
    handleCloseModal(); // Close the modal after submission
  };

  const handleDelete = (row) => {
    const filteredData = data.filter((item) => item.id !== row.original.id);
    setData(filteredData);
  };

  return (
    <>
    <h2 style={{textAlign:'center',fontSize:'25px', fontWeight:'600'}}>React-Table</h2>
    <hr />
    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
    <div className="add-new">
        <button onClick={()=>handleOpenModal()}>Add New</button>
    </div>
    {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{isEditing ? "Edit Row" : "Add New Row"}</h2>
            {columns
            .filter((column) => column.id !== "id") // Exclude 'id' column from inputs
            .map((column) => (
              <div key={column.accessor} className="modal-input">
                <input
                  type={column.accessor === "date_of_birth" ? "date" : "text"} // Set input type based on the column
                  value={newRow[column.accessor] || ""} // Controlled input value
                  onChange={(e) => handleInputChange(e, column.accessor)} // Handle input change
                  placeholder={column.Header} // Placeholder for input
                />
              </div>
            ))}
            <div className="modal-actions">
              <button className="model-submit" onClick={()=>handleSubmit()}>{isEditing ? "Update" : "Submit"}</button>
              <button className='model-cancel' onClick={()=>handleCloseModal()}>Cancel</button>
            </div>
          </div>
        </div>
      )}
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
          {page.map((row) => {
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
                <td>
                  <button className="btn-edit" onClick={() => handleOpenModal(row)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(row)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ textAlign: "center" }}>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to Page :{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const pageNumber = e.target.value
                ? Number(e.target.value) - 1
                : 0;
              gotoPage(pageNumber);
            }}
            style={{ width: "50px" }}
          />
        </span>
        <select value={pageSize} onChange={(e)=>setPageSize(Number(e.target.value))} >
            {[10,25,50].map((pageSize)=>(
                <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                </option>
            ))}
        </select>

        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>
      </div>
    </>
  );
};

export default CrudTable;
