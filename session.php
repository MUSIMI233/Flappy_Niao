<?php
session_start(); // 啟用 session

$method = $_SERVER['REQUEST_METHOD'];
// get route parameter
$route = isset($_GET['route']) ? $_GET['route'] : '';

// store session data
$data_file = 'session_data.json';

// handle route
if ($route === 'session_data') {
    if ($method === 'POST') {
        // get data
        $input_data = json_decode(file_get_contents('php://input'), true);

        if (!empty($input_data)) {
            $_SESSION['data'] = $input_data;
            $existing_data = json_decode(file_get_contents($data_file), true);
            $existing_data[session_id()] = $_SESSION['data'];

            // write session data to file
            file_put_contents($data_file, json_encode($existing_data, JSON_PRETTY_PRINT));
            header('Content-Type: application/json');
            echo json_encode(['status' => 'success', 'message' => 'Data saved to session and file']);
        } else {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['status' => 'error', 'message' => 'No data received']);
        }
        exit();
    }

    if ($method === 'GET') {
        $existing_data = json_decode(file_get_contents($data_file), true);

        if (isset($existing_data[session_id()])) {
            header('Content-Type: application/json');
            echo json_encode(['status' => 'success', 'data' => $existing_data[session_id()]['data']]);
        } else {
            // 如果 session 中沒有數據
            header('Content-Type: application/json');
            echo json_encode(['status' => 'error', 'message' => 'No data found for this session']);
        }
        exit();
    }

    // return 405 Method Not Allowed if no such method
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

// IF no such route
header('HTTP/1.1 404 Not Found');
echo json_encode(['status' => 'error', 'message' => 'Route not found']);
exit();