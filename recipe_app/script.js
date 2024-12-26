// Recipe data (for demonstration, you can replace it with a real API or database)
const recipes = [
    {
        name: 'Tomato Pasta',
        ingredients: ['tomato', 'pasta', 'cheese'],
        mood: 'comfort',
        description: 'A comforting tomato pasta with melted cheese.',
    },
    {
        name: 'Quick Salad',
        ingredients: ['lettuce', 'tomato', 'cucumber'],
        mood: 'healthy',
        description: 'A fresh and healthy salad.',
    },
    {
        name: 'Cheese Toast',
        ingredients: ['bread', 'cheese'],
        mood: 'quick',
        description: 'Quick and tasty cheese toast.',
    }
];

const moodRecipes = {
    comfort: ['Tomato Pasta'],
    quick: ['Cheese Toast'],
    healthy: ['Quick Salad'],
};

// Handle Recipe Search by Ingredients
document.getElementById('ingredients-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const ingredients = document.getElementById('ingredients-input').value.split(',').map(ingredient => ingredient.trim().toLowerCase());
    searchRecipesByIngredients(ingredients);
});

// Function to search recipes by ingredients
function searchRecipesByIngredients(ingredients) {
    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = ''; // Clear any previous results

    const matchingRecipes = recipes.filter(recipe => {
        return ingredients.every(ingredient => recipe.ingredients.includes(ingredient));
    });

    if (matchingRecipes.length === 0) {
        alert('No recipes found with these ingredients.');
        return;
    }

    // Display matching recipes
    matchingRecipes.forEach(recipe => {
        const recipeCard = `
            <div class="col-md-4">
                <div class="card">
                    <img src="https://via.placeholder.com/150" class="card-img-top" alt="${recipe.name}">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.name}</h5>
                        <p class="card-text">${recipe.description}</p>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#satisfactionModal" onclick="setSelectedRecipe('${recipe.name}')">Try this recipe</button>
                    </div>
                </div>
            </div>
        `;
        recipesContainer.innerHTML += recipeCard;
    });
}

// Handle Mood-Based Recipe Search
document.getElementById('mood-select').addEventListener('change', function (e) {
    const mood = e.target.value;
    showMoodRecipes(mood);
});

// Function to show recipes based on mood
function showMoodRecipes(mood) {
    const moodRecipesContainer = document.getElementById('mood-recipes-container');
    moodRecipesContainer.innerHTML = ''; // Clear previous results

    const recipesToDisplay = moodRecipes[mood];
    recipesToDisplay.forEach(recipeName => {
        const recipe = recipes.find(r => r.name === recipeName);
        const recipeCard = `
            <div class="col-md-4">
                <div class="card">
                    <img src="https://via.placeholder.com/150" class="card-img-top" alt="${recipe.name}">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.name}</h5>
                        <p class="card-text">${recipe.description}</p>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#satisfactionModal" onclick="setSelectedRecipe('${recipe.name}')">Try this recipe</button>
                    </div>
                </div>
            </div>
        `;
        moodRecipesContainer.innerHTML += recipeCard;
    });
}

// Store the selected recipe
let selectedRecipe = null;
function setSelectedRecipe(recipeName) {
    selectedRecipe = recipes.find(r => r.name === recipeName);
}

// Handle Satisfaction Modal Actions
document.querySelector('.btn-secondary').addEventListener('click', function () {
    // When the user clicks "Not Interested"
    const userResponse = confirm("Are you not interested in this recipe?");
    if (userResponse) {
        // If user confirms they're not interested, open the chatbot
        document.querySelector('.chat-container').style.display = 'block';
        showChatMessage("Looks like you're not interested in this recipe. How can I help?");
    }
});

document.querySelector('.btn-primary').addEventListener('click', function () {
    // If the user is satisfied, show the recipe details (currently just the name)
    alert(`You have selected the recipe: ${selectedRecipe.name}`);
});

// Chatbot Functions
const chatBox = document.getElementById('chat-box');
let isIngredientIssue = null; // Tracks if the issue is about missing ingredients
let missingIngredient = null; // Tracks the specific missing ingredient

document.getElementById('send-message').addEventListener('click', function () {
    const userMessage = document.getElementById('user-message').value.trim().toLowerCase();

    // Handle the case where user says "thank you"
    if (userMessage === 'thank you' || userMessage === 'thanks') {
        document.querySelector('.chat-container').style.display = 'none'; // Close the chat when "thank you" is received
        showChatMessage("You're welcome! Have a great day!");
        return; // Exit the function to prevent further processing
    }

    if (isIngredientIssue === null) {
        // First question: Ask if the issue is about missing ingredients
        if (userMessage === 'yes') {
            isIngredientIssue = true;
            showChatMessage("Tell me which ingredient is missing. I'll suggest a substitute ingredient for that.");
        } else if (userMessage === 'no') {
            isIngredientIssue = false;
            showChatMessage("Okay, I'll suggest new recipes for you.");
            suggestNewRecipes(); // Call function to display new recipes
        } else {
            showChatMessage("Is the issue about missing ingredients for this recipe? (Say yes or no)");
        }
    } else if (isIngredientIssue) {
        // Handle the case where the user mentions the missing ingredient
        missingIngredient = userMessage;
        const substitutes = getSubstituteIngredients(missingIngredient);
        if (substitutes.length > 0) {
            showChatMessage(`You can use ${substitutes.join(', ')} as substitutes for ${missingIngredient}.`);
            showChatMessage("Is that helpful? If yes, you can say 'thank you' to close the chat.");
        } else {
            showChatMessage(`I'm sorry, I don't have a substitute suggestion for ${missingIngredient}.`);
        }
    } else {
        // Handle fallback or unexpected messages
        showChatMessage("Let me know how else I can assist you.");
    }

    // Clear the input field after sending the message
    document.getElementById('user-message').value = '';
});

// Function to suggest new recipes (example logic)
function suggestNewRecipes() {
    showChatMessage("How about trying one of these recipes?");
    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = ''; // Clear current recipes
    recipes.forEach(recipe => {
        const recipeCard = `
            <div class="col-md-4">
                <div class="card">
                    <img src="https://via.placeholder.com/150" class="card-img-top" alt="${recipe.name}">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.name}</h5>
                        <p class="card-text">${recipe.description}</p>
                    </div>
                </div>
            </div>
        `;
        recipesContainer.innerHTML += recipeCard;
    });
}

// Function to get substitute ingredients
function getSubstituteIngredients(ingredient) {
    const substitutes = {
        tomato: ['canned tomato', 'red pepper puree'],
        cheese: ['mozzarella', 'parmesan', 'feta'],
        bread: ['pita', 'tortilla', 'bagel'],
    };
    return substitutes[ingredient] || [];
}

// Function to show chatbot messages
function showChatMessage(message) {
    const botMessage = document.createElement('div');
    botMessage.classList.add('chat-message', 'bot-message');
    botMessage.innerHTML = `<p>${message}</p>`;
    chatBox.appendChild(botMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}
