<template>
    <div class="development-page">
        <div class="content-container">
            <div class="development-message">
                <h2>Membership 功能正在开发中...</h2>
                <p>敬请期待！</p>
            </div>
        </div>
    </div>  
</template>
  
<script setup>
// 无需额外的脚本逻辑
</script>

<style scoped>
.development-page {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
}

.content-container {
    width: 100%;
    max-width: 600px;
}

.development-message {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 3rem;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.development-message h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    background: linear-gradient(90deg, #4A99E9, #5C2797);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
}

.development-message p {
    font-size: 1.5rem;
    opacity: 0.8;
    color: white;
}

@media (max-width: 768px) {
    .development-message h2 {
        font-size: 2rem;
    }
    
    .development-message p {
        font-size: 1.2rem;
    }
}
</style>