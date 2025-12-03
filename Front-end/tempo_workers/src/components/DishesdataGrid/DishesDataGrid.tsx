import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";
import DataGrid, { Column } from "../../shared/components/DataGrid/DataGrid";
import DishesType from "../../shared/types/dishes";
import PaginatedType from "../../shared/types/paginatedModel";
import { useGlobalStore } from "../../shared/state/globalStore";
import "./DishesDataGrid.scss";

interface Props {
  dishes: PaginatedType<DishesType>;
  limit: number;
  handleLimitChange: (limit: number) => void;
  page: number;
  setPage: (value: number) => void;
  handleEdit: (id: string, data: Partial<DishesType>) => void;
  handleDelete: (id: string) => void;
}

const DishesDataGrid = ({
  dishes,
  limit,
  handleLimitChange,
  page,
  setPage,
  handleEdit,
  handleDelete,
}: Props) => {
  const { updateDishes, fetchCategory, Category } = useGlobalStore();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [newDishes, setNewDishes] = useState<DishesType>({} as DishesType);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleOpenEditDialog = (row: DishesType) => {
    setEditId(row.id);
    setNewDishes(row);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditId(null);
    setNewDishes({} as DishesType);
  };

  const handleSave = async () => {
    if (editId) {
      await updateDishes(editId, newDishes);
    }
    handleCloseEdit();
  };

  const handleOpenDeleteDialog = (id: string) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteId(null);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      handleDelete(deleteId);
    }
    handleCloseDelete();
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewDishes({ ...newDishes, categoryId: event.target.value });
  };

  const columns: Column<DishesType>[] = [
    {
      field: "name",
      headerName: "Имя",
      width: 180,
      renderCell: ({ value }) => value || "",
    },
    {
      field: "approx_time",
      headerName: "Приблизительное время",
      width: 180,
      renderCell: ({ value }) => `${value} мин` || "",
    },
    {
      field: "price",
      headerName: "Цена",
      width: 180,
      renderCell: ({ value }) => `${value} р` || "",
    },
    {
      field: "category",
      headerName: "Категория",
      width: 180,
      renderCell: ({ row }) => row.category?.name || "",
    },
  ];

  const renderActions = (row: DishesType) => (
    <div className="action-buttons">
      <Button
        variant="success"
        size="sm"
        onClick={() => handleOpenEditDialog(row)}
        className="me-2"
      >
        <Pencil />
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() => handleOpenDeleteDialog(row.id)}
      >
        <Trash />
      </Button>
    </div>
  );

  return (
    <>
      <DataGrid
        rows={dishes ? dishes.items : []}
        columns={columns}
        page={page}
        pageCount={dishes?.pageCount || 1}
        total={dishes?.total || 0}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={handleLimitChange}
        getRowId={(row) => row.id}
        actions={renderActions}
      />

      <Modal show={openEdit} onHide={handleCloseEdit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Редактировать блюдо</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                value={newDishes.name || ""}
                onChange={(e) =>
                  setNewDishes({ ...newDishes, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Приблизительное время</Form.Label>
              <Form.Control
                type="number"
                value={newDishes.approx_time || ""}
                onChange={(e) =>
                  setNewDishes({
                    ...newDishes,
                    approx_time: Number(e.target.value),
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Цена</Form.Label>
              <Form.Control
                type="text"
                value={newDishes.price || ""}
                onChange={(e) =>
                  setNewDishes({ ...newDishes, price: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Категория</Form.Label>
              <Form.Select
                value={newDishes.categoryId || ""}
                onChange={handleCategoryChange}
              >
                <option value="">Выберите категорию</option>
                {Category.items
                  .filter((item) => item != null)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCloseEdit}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={openDelete} onHide={handleCloseDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Вы уверены, что хотите удалить это блюдо?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCloseDelete}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DishesDataGrid;
