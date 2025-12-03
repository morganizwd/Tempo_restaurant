import React from "react";
import { Table, Button, Form, InputGroup, Pagination } from "react-bootstrap";
import { ChevronLeft, ChevronRight, ChevronDoubleLeft, ChevronDoubleRight } from "react-bootstrap-icons";
import "./DataGrid.scss";

export interface Column<T> {
  field: keyof T | string;
  headerName: string;
  width?: number;
  renderCell?: (params: { row: T; value: any }) => React.ReactNode;
}

interface DataGridProps<T> {
  rows?: T[];
  columns: Column<T>[];
  page: number;
  pageCount: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  getRowId: (row: T) => string | number;
  actions?: (row: T) => React.ReactNode;
}

function DataGrid<T extends Record<string, any>>({
  rows = [],
  columns,
  page,
  pageCount,
  total,
  limit,
  onPageChange,
  onLimitChange,
  getRowId,
  actions,
}: DataGridProps<T>) {
  const handleFirstPage = () => onPageChange(1);
  const handlePrevPage = () => onPageChange(Math.max(1, page - 1));
  const handleNextPage = () => onPageChange(Math.min(pageCount, page + 1));
  const handleLastPage = () => onPageChange(pageCount);

  // Ensure rows is always an array
  const safeRows = rows || [];

  return (
    <div className="data-grid-wrapper">
      <div className="table-responsive">
        <Table hover className="data-grid-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={String(column.field)} style={{ width: column.width }}>
                  {column.headerName}
                </th>
              ))}
              {actions && <th style={{ width: 200 }}>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {safeRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-5">
                  <p className="text-muted mb-0">Нет данных для отображения</p>
                </td>
              </tr>
            ) : (
              safeRows.map((row) => (
                <tr key={getRowId(row)}>
                  {columns.map((column) => {
                    const field = column.field as keyof T;
                    const value = row[field];
                    return (
                      <td key={String(column.field)}>
                        {column.renderCell
                          ? column.renderCell({ row, value })
                          : String(value ?? "")}
                      </td>
                    );
                  })}
                  {actions && <td>{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <div className="data-grid-pagination">
        <div className="pagination-controls">
          <Form.Label className="mb-0 me-2">Размер страницы:</Form.Label>
          <Form.Select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            style={{ width: "auto" }}
            className="d-inline-block"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Form.Select>
        </div>

        <div className="pagination-info">
          <span className="text-muted">Всего записей: {total}</span>
        </div>

        <div className="pagination-buttons">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleFirstPage}
            disabled={page === 1}
          >
            <ChevronDoubleLeft />
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            <ChevronLeft />
          </Button>
          <span className="pagination-page-info">
            {page} / {pageCount}
          </span>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleNextPage}
            disabled={page >= pageCount}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleLastPage}
            disabled={page >= pageCount}
          >
            <ChevronDoubleRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DataGrid;

