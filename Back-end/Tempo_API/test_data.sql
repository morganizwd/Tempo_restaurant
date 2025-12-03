-- SQL скрипт для заполнения базы данных тестовыми данными
-- Использование: psql -U your_username -d tempo_restaurant -f test_data.sql

-- Очистка существующих данных (опционально, раскомментируйте если нужно)
-- TRUNCATE TABLE "Bill", "DrinkOrder", "DishOrder", "Order", "TablewareDish", "DishwareDish", "IngredientDish", "Drink", "Dish", "Tableware", "Dishware", "Ingredient", "Table", "Waiter", "Cook", "Employee", "User", "Category" CASCADE;

-- Вставка категорий
INSERT INTO "Category" ("Id", "Name", "CreatedAt", "UpdatedAt") VALUES
('11111111-1111-1111-1111-111111111111', 'Горячие блюда', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Холодные закуски', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Десерты', NOW(), NOW()),
('44444444-4444-4444-4444-444444444444', 'Напитки', NOW(), NOW()),
('55555555-5555-5555-5555-555555555555', 'Салаты', NOW(), NOW());

-- Вставка сотрудников (Employee)
INSERT INTO "Employee" ("Id", "Login", "Password", "CreatedAt", "UpdatedAt") VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin', 'admin123', NOW(), NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'waiter1', 'waiter123', NOW(), NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'waiter2', 'waiter123', NOW(), NOW()),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'cook1', 'cook123', NOW(), NOW()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'cook2', 'cook123', NOW(), NOW());

-- Вставка официантов (Waiter)
INSERT INTO "Waiter" ("Id", "Name", "Surname", "EmployeeId", "CreatedAt", "UpdatedAt") VALUES
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Иван', 'Иванов', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()),
('10101010-1010-1010-1010-101010101010', 'Мария', 'Петрова', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW(), NOW());

-- Вставка поваров (Cook)
INSERT INTO "Cook" ("Id", "Name", "Surname", "EmployeeId", "CategoryId", "CreatedAt", "UpdatedAt") VALUES
('20202020-2020-2020-2020-202020202020', 'Алексей', 'Сидоров', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('30303030-3030-3030-3030-303030303030', 'Елена', 'Кузнецова', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', NOW(), NOW());

-- Вставка столов (Table)
INSERT INTO "Table" ("Id", "Max_people", "WaiterId", "Number", "CreatedAt", "UpdatedAt") VALUES
('40404040-4040-4040-4040-404040404040', 4, 'ffffffff-ffff-ffff-ffff-ffffffffffff', 1, NOW(), NOW()),
('50505050-5050-5050-5050-505050505050', 2, 'ffffffff-ffff-ffff-ffff-ffffffffffff', 2, NOW(), NOW()),
('60606060-6060-6060-6060-606060606060', 6, 'ffffffff-ffff-ffff-ffff-ffffffffffff', 3, NOW(), NOW()),
('70707070-7070-7070-7070-707070707070', 4, '10101010-1010-1010-1010-101010101010', 4, NOW(), NOW()),
('80808080-8080-8080-8080-808080808080', 8, '10101010-1010-1010-1010-101010101010', 5, NOW(), NOW());

-- Вставка клиентов (User)
INSERT INTO "User" ("Id", "Name", "Phone", "CreatedAt", "UpdatedAt") VALUES
('90909090-9090-9090-9090-909090909090', 'Дмитрий', '+7 (999) 123-45-67', NOW(), NOW()),
('a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a0a0', 'Анна', '+7 (999) 234-56-78', NOW(), NOW()),
('b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b0', 'Сергей', '+7 (999) 345-67-89', NOW(), NOW());

-- Вставка ингредиентов (Ingredient)
INSERT INTO "Ingredient" ("Id", "Name", "In_stock", "CreatedAt", "UpdatedAt") VALUES
('c0c0c0c0-c0c0-c0c0-c0c0-c0c0c0c0c0c0', 'Мука', 50.0, NOW(), NOW()),
('d0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0', 'Яйца', 100.0, NOW(), NOW()),
('e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0', 'Молоко', 30.0, NOW(), NOW()),
('f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0', 'Говядина', 25.0, NOW(), NOW()),
('01010101-0101-0101-0101-010101010101', 'Курица', 30.0, NOW(), NOW()),
('02020202-0202-0202-0202-020202020202', 'Лук', 20.0, NOW(), NOW()),
('03030303-0303-0303-0303-030303030303', 'Помидоры', 15.0, NOW(), NOW()),
('04040404-0404-0404-0404-040404040404', 'Сыр', 18.0, NOW(), NOW()),
('05050505-0505-0505-0505-050505050505', 'Сахар', 40.0, NOW(), NOW()),
('06060606-0606-0606-0606-060606060606', 'Сливочное масло', 12.0, NOW(), NOW());

-- Вставка посуды для готовки (Dishware)
INSERT INTO "Dishware" ("Id", "Type", "In_stock", "CreatedAt", "UpdatedAt") VALUES
('07070707-0707-0707-0707-070707070707', 'Сковорода', 10.0, NOW(), NOW()),
('08080808-0808-0808-0808-080808080808', 'Кастрюля', 8.0, NOW(), NOW()),
('09090909-0909-0909-0909-090909090909', 'Противень', 6.0, NOW(), NOW()),
('0a0a0a0a-0a0a-0a0a-0a0a-0a0a0a0a0a0a', 'Форма для выпечки', 5.0, NOW(), NOW());

-- Вставка столовых приборов (Tableware)
INSERT INTO "Tableware" ("Id", "Type", "In_stock", "CreatedAt", "UpdatedAt") VALUES
('0b0b0b0b-0b0b-0b0b-0b0b-0b0b0b0b0b0b', 'Вилка', 50.0, NOW(), NOW()),
('0c0c0c0c-0c0c-0c0c-0c0c-0c0c0c0c0c0c', 'Нож', 50.0, NOW(), NOW()),
('0d0d0d0d-0d0d-0d0d-0d0d-0d0d0d0d0d0d', 'Ложка', 50.0, NOW(), NOW()),
('0e0e0e0e-0e0e-0e0e-0e0e-0e0e0e0e0e0e', 'Тарелка', 40.0, NOW(), NOW());

-- Вставка блюд (Dish)
INSERT INTO "Dish" ("Id", "Name", "Approx_time", "Price", "CategoryId", "Photo", "CreatedAt", "UpdatedAt") VALUES
('1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', 'Борщ', 30, 350.00, '11111111-1111-1111-1111-111111111111', 'https://example.com/borch.jpg', NOW(), NOW()),
('2a2a2a2a-2a2a-2a2a-2a2a-2a2a2a2a2a2a', 'Стейк из говядины', 25, 850.00, '11111111-1111-1111-1111-111111111111', 'https://example.com/steak.jpg', NOW(), NOW()),
('3a3a3a3a-3a3a-3a3a-3a3a-3a3a3a3a3a3a', 'Куриное филе в сливочном соусе', 20, 450.00, '11111111-1111-1111-1111-111111111111', 'https://example.com/chicken.jpg', NOW(), NOW()),
('4a4a4a4a-4a4a-4a4a-4a4a-4a4a4a4a4a4a', 'Цезарь', 15, 320.00, '55555555-5555-5555-5555-555555555555', 'https://example.com/caesar.jpg', NOW(), NOW()),
('5a5a5a5a-5a5a-5a5a-5a5a-5a5a5a5a5a5a', 'Греческий салат', 10, 280.00, '55555555-5555-5555-5555-555555555555', 'https://example.com/greek.jpg', NOW(), NOW()),
('6a6a6a6a-6a6a-6a6a-6a6a-6a6a6a6a6a6a', 'Тирамису', 15, 380.00, '33333333-3333-3333-3333-333333333333', 'https://example.com/tiramisu.jpg', NOW(), NOW()),
('7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a7a', 'Чизкейк', 20, 420.00, '33333333-3333-3333-3333-333333333333', 'https://example.com/cheesecake.jpg', NOW(), NOW()),
('8a8a8a8a-8a8a-8a8a-8a8a-8a8a8a8a8a8a', 'Брускетта', 10, 250.00, '22222222-2222-2222-2222-222222222222', 'https://example.com/bruschetta.jpg', NOW(), NOW());

-- Вставка напитков (Drink)
INSERT INTO "Drink" ("Id", "Name", "CategoryId", "Price", "Photo", "CreatedAt", "UpdatedAt") VALUES
('9a9a9a9a-9a9a-9a9a-9a9a-9a9a9a9a9a9a', 'Кола', '44444444-4444-4444-4444-444444444444', 150.00, 'https://example.com/cola.jpg', NOW(), NOW()),
('abababab-abab-abab-abab-abababababab', 'Сок апельсиновый', '44444444-4444-4444-4444-444444444444', 120.00, 'https://example.com/orange.jpg', NOW(), NOW()),
('bcbcbcbc-bcbc-bcbc-bcbc-bcbcbcbcbcbc', 'Кофе эспрессо', '44444444-4444-4444-4444-444444444444', 180.00, 'https://example.com/espresso.jpg', NOW(), NOW()),
('cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcdcd', 'Капучино', '44444444-4444-4444-4444-444444444444', 220.00, 'https://example.com/cappuccino.jpg', NOW(), NOW()),
('dededede-dede-dede-dede-dededededede', 'Чай черный', '44444444-4444-4444-4444-444444444444', 100.00, 'https://example.com/tea.jpg', NOW(), NOW()),
('efefefef-efef-efef-efef-efefefefefef', 'Вода минеральная', '44444444-4444-4444-4444-444444444444', 80.00, 'https://example.com/water.jpg', NOW(), NOW());

-- Вставка связи ингредиентов с блюдами (IngredientDish)
INSERT INTO "IngredientDish" ("Id", "Needed", "DishId", "IngredientId", "CreatedAt", "UpdatedAt") VALUES
-- Борщ
('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', 0.5, '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', 'f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0', NOW(), NOW()),
('f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2', 0.2, '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', '02020202-0202-0202-0202-020202020202', NOW(), NOW()),
('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3', 0.3, '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', '03030303-0303-0303-0303-030303030303', NOW(), NOW()),
-- Стейк
('f4f4f4f4-f4f4-f4f4-f4f4-f4f4f4f4f4f4', 0.3, '2a2a2a2a-2a2a-2a2a-2a2a-2a2a2a2a2a2a', 'f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0', NOW(), NOW()),
('f5f5f5f5-f5f5-f5f5-f5f5-f5f5f5f5f5f5', 0.1, '2a2a2a2a-2a2a-2a2a-2a2a-2a2a2a2a2a2a', '06060606-0606-0606-0606-060606060606', NOW(), NOW()),
-- Куриное филе
('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 0.25, '3a3a3a3a-3a3a-3a3a-3a3a-3a3a3a3a3a3a', '01010101-0101-0101-0101-010101010101', NOW(), NOW()),
('f7f7f7f7-f7f7-f7f7-f7f7-f7f7f7f7f7f7', 0.15, '3a3a3a3a-3a3a-3a3a-3a3a-3a3a3a3a3a3a', 'e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0', NOW(), NOW()),
-- Цезарь
('f8f8f8f8-f8f8-f8f8-f8f8-f8f8f8f8f8f8', 0.15, '4a4a4a4a-4a4a-4a4a-4a4a-4a4a4a4a4a4a', '01010101-0101-0101-0101-010101010101', NOW(), NOW()),
('f9f9f9f9-f9f9-f9f9-f9f9-f9f9f9f9f9f9', 0.1, '4a4a4a4a-4a4a-4a4a-4a4a-4a4a4a4a4a4a', '04040404-0404-0404-0404-040404040404', NOW(), NOW()),
-- Тирамису
('faafafaf-afaf-afaf-afaf-afafafafafaf', 0.2, '6a6a6a6a-6a6a-6a6a-6a6a-6a6a6a6a6a6a', 'd0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0', NOW(), NOW()),
('fbfbfbfb-fbfb-fbfb-fbfb-fbfbfbfbfbfb', 0.15, '6a6a6a6a-6a6a-6a6a-6a6a-6a6a6a6a6a6a', '05050505-0505-0505-0505-050505050505', NOW(), NOW());

-- Вставка связи посуды с блюдами (DishwareDish)
INSERT INTO "DishwareDish" ("Id", "DishwareId", "DishId", "CreatedAt", "UpdatedAt") VALUES
('fcfcfcfc-fcfc-fcfc-fcfc-fcfcfcfcfcfc', '07070707-0707-0707-0707-070707070707', '2a2a2a2a-2a2a-2a2a-2a2a-2a2a2a2a2a2a', NOW(), NOW()),
('fdfdfdfd-fdfd-fdfd-fdfd-fdfdfdfdfdfd', '07070707-0707-0707-0707-070707070707', '3a3a3a3a-3a3a-3a3a-3a3a-3a3a3a3a3a3a', NOW(), NOW()),
('fefefefe-fefe-fefe-fefe-fefefefefefe', '08080808-0808-0808-0808-080808080808', '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', NOW(), NOW()),
('ff0f0f0f-0f0f-0f0f-0f0f-0f0f0f0f0f0f', '09090909-0909-0909-0909-090909090909', '6a6a6a6a-6a6a-6a6a-6a6a-6a6a6a6a6a6a', NOW(), NOW()),
('ff1f1f1f-1f1f-1f1f-1f1f-1f1f1f1f1f1f', '09090909-0909-0909-0909-090909090909', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a7a', NOW(), NOW());

-- Вставка связи столовых приборов с блюдами (TablewareDish)
INSERT INTO "TablewareDish" ("Id", "TablewareId", "DishId", "Number", "CreatedAt", "UpdatedAt") VALUES
('ff2f2f2f-2f2f-2f2f-2f2f-2f2f2f2f2f2f', '0b0b0b0b-0b0b-0b0b-0b0b-0b0b0b0b0b0b', '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', 1, NOW(), NOW()),
('ff3f3f3f-3f3f-3f3f-3f3f-3f3f3f3f3f3f', '0c0c0c0c-0c0c-0c0c-0c0c-0c0c0c0c0c0c', '2a2a2a2a-2a2a-2a2a-2a2a-2a2a2a2a2a2a', 1, NOW(), NOW()),
('ff4f4f4f-4f4f-4f4f-4f4f-4f4f4f4f4f4f', '0b0b0b0b-0b0b-0b0b-0b0b-0b0b0b0b0b0b', '4a4a4a4a-4a4a-4a4a-4a4a-4a4a4a4a4a4a', 1, NOW(), NOW()),
('ff5f5f5f-5f5f-5f5f-5f5f-5f5f5f5f5f5f', '0d0d0d0d-0d0d-0d0d-0d0d-0d0d0d0d0d0d', '6a6a6a6a-6a6a-6a6a-6a6a-6a6a6a6a6a6a', 1, NOW(), NOW()),
('ff6f6f6f-6f6f-6f6f-6f6f-6f6f6f6f6f6f', '0e0e0e0e-0e0e-0e0e-0e0e-0e0e0e0e0e0e', '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', 1, NOW(), NOW());

-- Вставка заказов (Order)
-- OrderStatus: 0=Ordered, 1=Cooking, 2=Delivering, 3=Ready
INSERT INTO "Order" ("Id", "People_num", "Status", "TableId", "UserId", "CreatedAt", "UpdatedAt") VALUES
('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 2, 0, '40404040-4040-4040-4040-404040404040', '90909090-9090-9090-9090-909090909090', NOW(), NOW()),
('a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2', 4, 1, '60606060-6060-6060-6060-606060606060', 'a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a0a0', NOW(), NOW()),
('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3', 2, 2, '50505050-5050-5050-5050-505050505050', 'b0b0b0b0-b0b0-b0b0-b0b0-b0b0b0b0b0b0', NOW(), NOW()),
('a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a4a4', 6, 3, '80808080-8080-8080-8080-808080808080', '90909090-9090-9090-9090-909090909090', NOW(), NOW());

-- Вставка блюд в заказы (DishOrder)
INSERT INTO "DishOrder" ("Id", "DishId", "OrderId", "Number", "CreatedAt", "UpdatedAt") VALUES
('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 2, NOW(), NOW()),
('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', '4a4a4a4a-4a4a-4a4a-4a4a-4a4a4a4a4a4a', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 1, NOW(), NOW()),
('b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b3b3', '2a2a2a2a-2a2a-2a2a-2a2a-2a2a2a2a2a2a', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2', 2, NOW(), NOW()),
('b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b4b4', '3a3a3a3a-3a3a-3a3a-3a3a-3a3a3a3a3a3a', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2', 2, NOW(), NOW()),
('b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b5b5b5', '5a5a5a5a-5a5a-5a5a-5a5a-5a5a5a5a5a5a', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2', 1, NOW(), NOW()),
('b6b6b6b6-b6b6-b6b6-b6b6-b6b6b6b6b6b6', '6a6a6a6a-6a6a-6a6a-6a6a-6a6a6a6a6a6a', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3', 1, NOW(), NOW()),
('b7b7b7b7-b7b7-b7b7-b7b7-b7b7b7b7b7b7', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a7a', 'a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a4a4', 2, NOW(), NOW());

-- Вставка напитков в заказы (DrinkOrder)
INSERT INTO "DrinkOrder" ("Id", "DrinkId", "OrderId", "Number", "CreatedAt", "UpdatedAt") VALUES
('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', '9a9a9a9a-9a9a-9a9a-9a9a-9a9a9a9a9a9a', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 2, NOW(), NOW()),
('c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'bcbcbcbc-bcbc-bcbc-bcbc-bcbcbcbcbcbc', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 2, NOW(), NOW()),
('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'abababab-abab-abab-abab-abababababab', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2', 4, NOW(), NOW()),
('c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', 'dededede-dede-dede-dede-dededededede', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3', 2, NOW(), NOW()),
('c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', 'cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcdcd', 'a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a4a4', 6, NOW(), NOW());

-- Вставка счетов (Bill)
INSERT INTO "Bill" ("Id", "Cash", "OrderId", "CreatedAt", "UpdatedAt") VALUES
('d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', false, 'a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a4a4', NOW(), NOW());

-- Вывод информации о вставленных данных
SELECT 'Данные успешно вставлены!' as status;
SELECT COUNT(*) as categories_count FROM "Category";
SELECT COUNT(*) as employees_count FROM "Employee";
SELECT COUNT(*) as waiters_count FROM "Waiter";
SELECT COUNT(*) as cooks_count FROM "Cook";
SELECT COUNT(*) as tables_count FROM "Table";
SELECT COUNT(*) as users_count FROM "User";
SELECT COUNT(*) as dishes_count FROM "Dish";
SELECT COUNT(*) as drinks_count FROM "Drink";
SELECT COUNT(*) as orders_count FROM "Order";

