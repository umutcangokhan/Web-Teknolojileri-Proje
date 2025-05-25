<?php
// Daha güvenli bir başlangıç
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Giriş bilgilerini temizle
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);
    
    // Doğrulama kontrolü
    $isValid = (!empty($email) && !empty($password) 
               && preg_match('/^b\d{9}@sakarya\.edu\.tr$/', $email) 
               && preg_match('/^b\d{9}$/', $password)
               && explode('@', $email)[0] === $password;

    if ($isValid) {
        $_SESSION['authenticated'] = true;
        $_SESSION['student_number'] = $password;
        
        // HTML çıktısından önce header'ı temizle
        ob_start();
        header_remove();
        
        // Doğru content-type header'ı
        header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hoşgeldiniz - <?= htmlspecialchars($_SESSION['student_number']) ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            background-color: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .welcome-card {
            width: 100%;
            max-width: 500px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="card welcome-card">
        <div class="card-body text-center p-5">
            <div class="mb-4">
                <i class="fas fa-check-circle text-success" style="font-size: 3rem;"></i>
            </div>
            <h2 class="card-title mb-3">Giriş Başarılı!</h2>
            <p class="card-text mb-4">Hoşgeldiniz <strong><?= htmlspecialchars($_SESSION['student_number']) ?></strong></p>
            <a href="index.html" class="btn btn-primary">
                <i class="fas fa-home me-2"></i>Ana Sayfaya Dön
            </a>
        </div>
    </div>
</body>
</html>
<?php
        ob_end_flush();
        exit();
    }
}

// Hatalı giriş durumunda
header("Location: login.html?error=1");
exit();
?>