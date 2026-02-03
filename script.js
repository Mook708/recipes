// --- 您的食譜資料庫 ---
// 您可以在這裡新增、修改或刪除食譜
// 圖片路徑請確認與 images 資料夾中的檔名一致


const app = document.getElementById('app');
let recipes = []; // 先定義全域變數

// 1. 從 Firebase 抓取資料
async function fetchRecipesAndRender() {
    try {
        const snapshot = await db.collection("recipes").get();
        recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderCategories(); 
    } catch (error) {
        console.error("抓取資料失敗:", error);
        app.innerHTML = "<p>暫時無法載入食譜，請檢查資料庫設定。</p>";
    }
}

// 2. 渲染首頁類別
// --- 修改渲染首頁，增加前往新增頁面的入口 ---
function renderCategories() {
    const categories = [...new Set(recipes.map(recipe => recipe.category))];
    app.innerHTML = `
        <h2>選擇類別</h2>
        <div class="category-grid">
            ${categories.map(category => `
                <div class="category-card" onclick="renderRecipeList('${category}')">
                    ${category}
                </div>
            `).join('')}
        </div>
        <div class="add-button" onclick="showAddPage()">＋ 新增私房菜</div>
    `;
}

// --- 1. 新增：顯示「完整新增頁面」 ---
function showAddPage() {
    app.innerHTML = `
        <a href="#" onclick="renderCategories()" class="back-button">‹ 取消返回</a>
        <div class="recipe-content">
            <h1>新增私房菜</h1>
            <div class="edit-form">
                <label>菜名</label>
                <input type="text" id="new-name" placeholder=" ">
                <label>類別</label>
                <input type="text" id="new-category" placeholder="例如：肉類">
                <label>圖片路徑 (請先空著)</label>
                <input type="text" id="new-image" value="images/default.jpg">
                <label>食材 (請用換行隔開)</label>
                <textarea id="new-ingredients" rows="3"></textarea>
                <label>作法 (步驟用換行隔開)</label>
                <textarea id="new-steps" rows="5"></textarea>
                <button class="save-button" onclick="saveNewRecipe()">確認新增</button>
            </div>
        </div>
    `;
}

// --- 2. 新增：顯示「編輯頁面」 ---
function showEditPage(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    app.innerHTML = `
        <a href="#" onclick="renderRecipeDetail('${recipe.id}')" class="back-button">‹ 取消編輯</a>
        <div class="recipe-content">
            <h1>編輯：${recipe.name}</h1>
            <div class="edit-form">
                <label>菜名</label>
                <input type="text" id="edit-name" value="${recipe.name}">
                <label>類別</label>
                <input type="text" id="edit-category" value="${recipe.category}">
                <label>圖片路徑 (請先空著)</label>
                <input type="text" id="edit-image" value="${recipe.image}">
                <label>食材 (請用換行隔開)</label>
                <textarea id="edit-ingredients" rows="5">${recipe.ingredients.join('\n')}</textarea>
                <label>作法 (步驟用換行隔開)</label>
                <textarea id="edit-steps" rows="8">${recipe.steps.join('\n')}</textarea>
                <button class="save-button" onclick="updateRecipe('${recipe.id}')">儲存修改</button>
            </div>
        </div>
    `;
}

// --- 3. 儲存與更新邏輯 ---
async function saveNewRecipe() {
    const data = {
        name: document.getElementById('new-name').value,
        category: document.getElementById('new-category').value,
        image: document.getElementById('new-image').value,
        ingredients: document.getElementById('new-ingredients').value.split('\n'),
        steps: document.getElementById('new-steps').value.split('\n')
    };
    if(data.name && data.category) {
        await db.collection("recipes").add(data);
        alert("新增成功！");
        fetchRecipesAndRender();
    }
}

async function updateRecipe(id) {
    const updatedData = {
        name: document.getElementById('edit-name').value,
        category: document.getElementById('edit-category').value,
        image: document.getElementById('edit-image').value,
        ingredients: document.getElementById('edit-ingredients').value.split('\n'),
        steps: document.getElementById('edit-steps').value.split('\n')
    };
    await db.collection("recipes").doc(id).update(updatedData);
    alert("更新成功！");
    fetchRecipesAndRender();
}


// 3. 渲染菜名列表
function renderRecipeList(category) {
    const categoryRecipes = recipes.filter(recipe => recipe.category === category);
    app.innerHTML = `
        <a href="#" onclick="renderCategories()" class="back-button">‹ 返回類別</a>
        <h2>${category}</h2>
        <div class="recipe-grid">
            ${categoryRecipes.map(recipe => `
                <div class="recipe-card" onclick="renderRecipeDetail('${recipe.id}')">
                    ${recipe.name}
                </div>
            `).join('')}
        </div>
    `;
}

// 4. 渲染食譜內容
// --- 修改：在詳情頁面加入「編輯」按鈕 ---
function renderRecipeDetail(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    app.innerHTML = `
        <a href="#" onclick="renderRecipeList('${recipe.category}')" class="back-button">‹ 返回菜單</a>
        <div class="recipe-content">
            <div style="display:flex; justify-content: space-between; align-items: center;">
                <h1>${recipe.name}</h1>
                <div>
                    <button onclick="showEditPage('${recipe.id}')" style="background:#accent-color; cursor:pointer;">編輯</button>
                    <button onclick="deleteRecipe('${recipe.id}')" style="background:#e57373; color:white;">刪除</button>
                </div>
            </div>
            <img src="${recipe.image}" alt="${recipe.name}">
            <h2>食材</h2>
            <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
            <h2>作法</h2>
            <ol>${recipe.steps.map(step => `<li>${step}</li>`).join('')}</ol>
        </div>
    `;
}

// 5. 新增食譜功能
async function addRecipe() {
    const name = prompt("請輸入菜名：");
    const category = prompt("請輸入類別（例如：肉類料理）：");
    const ingredientsInput = prompt("請輸入食材（用逗號分開）：");
    const stepsInput = prompt("請輸入作法（用逗號分開）：");

    if (name && category) {
        await db.collection("recipes").add({
            name: name,
            category: category,
            image: "images/default.jpg",
            ingredients: ingredientsInput ? ingredientsInput.split(",") : [],
            steps: stepsInput ? stepsInput.split(",") : []
        });
        alert("新增成功！");
        fetchRecipesAndRender();
    }
}

// 6. 刪除功能
async function deleteRecipe(id) {
    if (confirm("確定要刪除嗎？")) {
        await db.collection("recipes").doc(id).delete();
        alert("已刪除！");
        fetchRecipesAndRender();
    }
}

// 啟動程式
fetchRecipesAndRender();