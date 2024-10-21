<?php
session_start();

// 检查是否通过 POST 方法提交分数
if (isset($_POST['score'])) {
    // 保存玩家的分数到会话
    $_SESSION['score'] = $_POST['score'];

    // 假设通关分数为5，这里可以根据逻辑设置解锁的内容
    if ($_SESSION['score'] >= 5) {
        $_SESSION['game_status'] = 'pass';  // 表示游戏通关
    } else {
        $_SESSION['game_status'] = 'fail';  // 游戏失败或未达标
    }

    // 输出一个成功消息，AJAX可以读取此响应
    echo json_encode(['status' => 'success', 'score' => $_SESSION['score']]);
}
?>