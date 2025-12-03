import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import DishesDataGrid from './DishesDataGrid';
import DishesType from '../../shared/types/dishes';
import { useGlobalStore } from '../../shared/state/globalStore';
import CategoryType from '../../shared/types/category';
import "./DishesComponent.scss";

const DishesComponent = () => {
    const { Dishes, fetchDishes, deleteDishes, updateDishes, createDishes, Category, fetchCategory } = useGlobalStore();
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [newDishes, setNewDishes] = useState({} as DishesType);
    const [selectedDishes, setSelectedDishes] = useState<DishesType | null>(null);
    const [limit, setLimit] = useState(5);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchDishes(page, limit);
        fetchCategory();
    }, [page, limit, open, editOpen]);

    const handleDelete = (id: string) => {
        deleteDishes(id);
    };

    const handleOpenEditDialog = (dishes: {
        id: string; name?: string; approx_time?: number;
        price?: string;
    }) => {
        setSelectedDishes({
            id: dishes.id,
            name: dishes.name ?? '',
            approx_time: dishes.approx_time ?? 0,
            price: dishes.price ?? '',
            category: {} as CategoryType,
            categoryId: ""
        });
        setEditOpen(true);
    };

    const handleCloseEdit = () => {
        setSelectedDishes(null);
        setEditOpen(false);
    };

    const handleEditSave = () => {
        if (selectedDishes && selectedDishes.id) {
            updateDishes(selectedDishes.id, selectedDishes);
            handleCloseEdit();
        } else {
            alert("Все поля должны быть заполнены!");
        }
    };

    const handleCreate = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewDishes({} as DishesType);
    };

    const handleSave = () => {
        createDishes(newDishes);
        handleClose();
    };

    const handleLimitChange = (limit: number) => {
        setLimit(limit);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNewDishes({ ...newDishes, categoryId: event.target.value });
    };

    return (
        <>
            <div className="dishes-header">
                <Button
                    variant="primary"
                    onClick={handleCreate}
                    className="add-button"
                >
                    <Plus className="me-2" />
                    Добавить блюдо
                </Button>
            </div>
            <DishesDataGrid
                dishes={Dishes}
                limit={limit}
                handleLimitChange={handleLimitChange}
                page={page}
                setPage={setPage}
                handleEdit={(id, data) => handleOpenEditDialog({ id, ...data })}
                handleDelete={handleDelete}
            />

            <Modal show={open} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Создать блюдо</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Название</Form.Label>
                            <Form.Control
                                type="text"
                                value={newDishes.name || ""}
                                onChange={(e) => setNewDishes({ ...newDishes, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Приблизительное время (мин)</Form.Label>
                            <Form.Control
                                type="number"
                                value={newDishes.approx_time || ""}
                                onChange={(e) => setNewDishes({ ...newDishes, approx_time: Number(e.target.value) })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Цена</Form.Label>
                            <Form.Control
                                type="text"
                                value={newDishes.price || ""}
                                onChange={(e) => setNewDishes({ ...newDishes, price: e.target.value })}
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
                    <Button variant="outline-secondary" onClick={handleClose}>Отмена</Button>
                    <Button variant="primary" onClick={handleSave}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DishesComponent;
