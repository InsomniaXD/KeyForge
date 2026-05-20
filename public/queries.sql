-- 1. All users (no passwords)
SELECT id, firstName, lastName, email, createdAt FROM users;

-- 2. Order summary per user
SELECT u.firstName, u.lastName, COUNT(o.id) AS total_orders,
       SUM(o.totalPrice) AS total_spent
FROM users u LEFT JOIN orders o ON u.email = o.userEmail
GROUP BY u.email ORDER BY total_spent DESC;

-- 3. Builds per order
SELECT o.id AS Order_ID,
       (seq.seq + 1) AS Build_Number,
       JSON_VALUE(o.items, CONCAT('$[', seq.seq, '].case.name'))    AS Kit,
       JSON_VALUE(o.items, CONCAT('$[', seq.seq, '].switch.name'))  AS Switch,
       JSON_VALUE(o.items, CONCAT('$[', seq.seq, '].keycaps.name')) AS Keycaps,
       JSON_VALUE(o.items, CONCAT('$[', seq.seq, '].totalPrice'))   AS 'Price (£)'
FROM orders o
JOIN (SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2
      UNION ALL SELECT 3 UNION ALL SELECT 4) seq
  ON JSON_VALUE(o.items, CONCAT('$[', seq.seq, '].case.name')) IS NOT NULL
ORDER BY o.id, Build_Number;

-- 4. Most popular kits across all orders
SELECT JSON_VALUE(items, CONCAT('$[', seq.seq, '].case.name')) AS Kit,
       COUNT(*) AS times_ordered
FROM orders
JOIN (SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2
      UNION ALL SELECT 3 UNION ALL SELECT 4) seq
  ON JSON_VALUE(items, CONCAT('$[', seq.seq, '].case.name')) IS NOT NULL
GROUP BY Kit ORDER BY times_ordered DESC;

-- 5. Most popular switches
SELECT JSON_VALUE(items, CONCAT('$[', seq.seq, '].switch.name')) AS Switch,
       COUNT(*) AS times_ordered
FROM orders
JOIN (SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2
      UNION ALL SELECT 3 UNION ALL SELECT 4) seq
  ON JSON_VALUE(items, CONCAT('$[', seq.seq, '].switch.name')) IS NOT NULL
GROUP BY Switch ORDER BY times_ordered DESC;

-- 6. Revenue by payment method
SELECT paymentMethod, COUNT(*) AS orders, SUM(totalPrice) AS revenue
FROM orders GROUP BY paymentMethod ORDER BY revenue DESC;

-- 7. Daily order volume
SELECT orderDate, COUNT(*) AS orders, SUM(totalPrice) AS revenue
FROM orders GROUP BY orderDate ORDER BY orderDate DESC;

-- 8. Products catalog by category
SELECT category, name, price FROM products ORDER BY category, price;

-- 9. Full order detail (single order — replace 1 with any order ID)
SELECT o.id, o.userEmail, o.totalPrice, o.paymentMethod,
       o.orderDate, o.shipping
FROM orders o WHERE o.id = 1;