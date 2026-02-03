// --- 您的食譜資料庫 ---
// 您可以在這裡新增、修改或刪除食譜
// 圖片路徑請確認與 images 資料夾中的檔名一致
const recipes = [
    {
        id: 1,
        name: "媽媽的紅燒肉",
        category: "肉類料理",
        image: "images/滷肉.jpg",
        ingredients: [
            "豬五花肉 600克",
            "青蔥 2根",
            "薑 5片",
            "大蒜 5瓣",
            "醬油 100毫升",
            "米酒 50毫升",
            "冰糖 30克",
            "八角 2顆"
        ],
        steps: [
            "將豬五花肉切塊，放入滾水中汆燙後撈起備用。",
            "熱鍋後不放油，將豬五花肉塊的各面煎至金黃。",
            "將煎好的五花肉推至鍋邊，用鍋中逼出的豬油爆香蔥段、薑片、蒜瓣。",
            "加入醬油、米酒、冰糖和八角，與所有食材拌炒均勻。",
            "加入水（水量需淹過豬肉），大火煮滾後轉小火，蓋上鍋蓋燉煮約60分鐘即可。"
        ]
    },
    {
        id: 2,
        name: "家常番茄炒蛋",
        category: "蛋類&蔬菜",
        image: "images/番茄炒蛋.jpg",
        ingredients: [
            "牛番茄 2顆",
            "雞蛋 3顆",
            "蔥花 少許",
            "鹽 適量",
            "糖 一小匙"
        ],
        steps: [
            "將雞蛋打散，加入少許鹽調味。",
            "番茄洗淨後切塊備用。",
            "熱油鍋，倒入蛋液，炒至半熟後盛起。",
            "鍋中再次放油，放入番茄塊翻炒至軟。",
            "加入炒好的蛋，並用鹽和糖調味。",
            "起鍋前撒上蔥花即可。"
        ]
    },
    // --- 在此處新增更多食譜 ---
    // {
    //     id: 3,
    //     name: "食譜名稱",
    //     category: "食譜類別",
    //     image: "images/圖片檔名.jpg",
    //     ingredients: [ "食材1", "食材2" ],
    //     steps: [ "步驟1", "步驟2" ]
    // }
];

const app = document.getElementById('app');

// 渲染首頁 (類別列表)
function renderCategories() {
    // 從食譜資料中取得所有不重複的類別
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
    `;
}

// 渲染菜名列表
function renderRecipeList(category) {
    const categoryRecipes = recipes.filter(recipe => recipe.category === category);
    
    app.innerHTML = `
        <a href="#" onclick="renderCategories()" class="back-button">‹ 返回類別</a>
        <h2>${category}</h2>
        <div class="recipe-grid">
            ${categoryRecipes.map(recipe => `
                <div class="recipe-card" onclick="renderRecipeDetail(${recipe.id})">
                    ${recipe.name}
                </div>
            `).join('')}
        </div>
    `;
}

// 渲染食譜內容
function renderRecipeDetail(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    
    app.innerHTML = `
        <a href="#" onclick="renderRecipeList('${recipe.category}')" class="back-button">‹ 返回菜單</a>
        <div class="recipe-content">
            <h1>${recipe.name}</h1>
            <img src="${recipe.image}" alt="${recipe.name}">
            
            <h2>食材</h2>
            <ul>
                ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            
            <h2>作法</h2>
            <ol>
                ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>
    `;
}

// 初始載入
renderCategories();