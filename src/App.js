import React, { useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = 'https://finvest-server.vercel.app';

const Table = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const UpdateSuccessfulToast = () => {
    console.log("Showing toast");
    toast.success("Update successful!", {
      autoClose: 5000,
    });

    return (
      <div>
        <h1>Update successful!</h1>
      </div>
    );
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/items`);
      const data = await response.json();
      setTableData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updatePrice = async (id, newPrice) => {
    // const response = await fetch(`http://localhost:3000/api/items/${id}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     price: newPrice,
    //   }),
    // });
    // const updatedItem = await response.json();
    // console.log(updatedItem);
    const updatedData = tableData.map((item) => {
      if (item.id === id) {
        // console.log("updating item : ", updatedItem);
        // return updatedItem;
        return {
          ...item,
          price: newPrice,
        };
      }
      return item;
    });
    console.log(updatedData);
    setTableData(updatedData);
  };

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(`${API_URL}/api/items`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tableData),
      });
      if (response.ok) {
        console.log("Data saved successfully!");
        await fetchData();
        UpdateSuccessfulToast();
        setIsSaving(false);
      } else {
        console.error("Error saving data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ cell }) => (
          <img
            src={cell.row.original.image}
            alt={cell.row.original.name}
            width="50"
            height="50"
          />
        ),
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "Label",
        accessor: "label",
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ cell }) => (
          <input
            type="number"
            value={cell.value}
            onChange={(e) => updatePrice(cell.row.original.id, e.target.value)}
          />
        ),
      },
      {
        Header: "Description",
        accessor: "description",
      },
    ],
    [tableData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: tableData,
        initialState: {
          sortBy: [{ id: "price", desc: false }],
        },
      },
      useSortBy
    );

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : isSaving ? (
        <div>Saving...</div>
      ) : (
        <>
          <ToastContainer />
          <table {...getTableProps()} style={{ borderCollapse: "collapse" }}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      style={{
                        borderBottom: "2px solid #000",
                        background: "#f2f2f2",
                        fontWeight: "bold",
                        padding: "8px",
                      }}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " ↓"
                            : " ↑"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          borderBottom: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button onClick={saveChanges}>Save</button>
        </>
      )}
    </div>
  );
};

export default Table;
