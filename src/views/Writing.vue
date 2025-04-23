<template>
    <div class="development-page">
        <div class="background-effects">
            <div class="gradient-orb top-left"></div>
            <div class="gradient-orb bottom-right"></div>
            <div class="grid-overlay"></div>
        </div>

        <div class="content-container">
            <div class="development-message">
                <h2>Writing 功能正在开发中...</h2>
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
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

.background-effects {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.gradient-orb {
    position: absolute;
    width: 40vw;
    height: 40vw;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.3;
}

.top-left {
    top: -20vw;
    left: -20vw;
    background: linear-gradient(45deg, #4A99E9, #5C2797);
}

.bottom-right {
    bottom: -20vw;
    right: -20vw;
    background: linear-gradient(45deg, #5C2797, #4A99E9);
}

.grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
}

.content-container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 600px;
    padding: 2rem;
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