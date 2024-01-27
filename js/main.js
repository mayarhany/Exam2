// ^ App Variables
const leftSpace = $('.side-nav-inner').innerWidth();
let dataEl = document.querySelector('#data');
const searchInputsEl = document.querySelector('#searchInputs');
const searchBtn = document.querySelector('.search');
const categoryBtn = document.querySelector('.category');
const areaBtn = document.querySelector('.area');
const ingredientBtn = document.querySelector('.ingredient');
const contactBtn = document.querySelector('.contact');


// * Loading Screen
$(document).ready(() => {
    $('.loading').fadeOut(1000)
    $('body').css('overflow', 'auto')
})


// !Functions

// ^ Side Nav
// $('.side-nav').css('left', -leftSpace); 

function openSideNav(){
    $('.side-nav').css('left', 0);
    $('.open').removeClass('d-inline-block');
    $('.open').addClass('d-none');
    $('.close').removeClass('d-none');
    $('.close').addClass('d-inline-block');

    $('.side-nav-inner .links li').addClass('position-relative');

    for (let i = 0; i < 5; i++) {
        $('.side-nav-inner .links li').eq(i).animate({top:0}, (i+3)*100);
    }
}

function closeSideNav(){
    $('.side-nav').css('left', -leftSpace);
    $('.close').removeClass('d-inline-block');
    $('.close').addClass('d-none');
    $('.open').removeClass('d-none');
    $('.open').addClass('d-inline-block');

    $('.side-nav-inner .links li').addClass('position-relative');

    $('.side-nav-inner .links li').animate({top : 300}, 500);
}

closeSideNav()

$('.open').click(openSideNav)
$('.close').click(closeSideNav)




// ~ Displaying Meals(in openning page)
async function getMeals(){

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    let data = await response.json();
    let meals = data.meals;

    displayMeals(meals);
}
getMeals();

function displayMeals(list){
    let newMeal = ``;
    
    for (let i = 0 ; i < list.length ; i++) {
        newMeal += `
        <div class="col-md-3">
                    <div onclick="getMealDetails(${list[i].idMeal})" class="meal position-relative rounded-2 overflow-hidden cursor-pointer">
                        <img src="${list[i].strMealThumb}" class="w-100" alt=""/>
                        <div class="layer d-flex align-items-center position-absolute">
                            <h3 class="ps-2">${list[i].strMeal}</h3>
                        </div>
                    </div>
        </div>
        `
    }
    dataEl.innerHTML = newMeal;
}


// ^ Meal Details
function getMealDetails(id){
    closeSideNav();
    dataEl.innerHTML = "";

    $('.loading').fadeIn(500, async function(){

        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        let data = await response.json();
        let meals = data.meals;   

        displayMealDetails(meals[0]);   
        $('.loading').fadeOut(500);
    });
    
}

function displayMealDetails(meal){
    searchInputsEl.innerHTML = ``;

    let Tag = ``;
    if(meal.strTags !== null){
        let tags = meal.strTags.split(',');
        if(tags === false){
            tags = []
        }
        for (let i = 0; i < tags.length; i++) {
            Tag += `<li class="alert alert-danger m-1 p-2">${tags[i]}</li>`
        }
    }

    let mealIngredients = ``;
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`] !== '') {
            mealIngredients += `
            <li class="alert alert-info m-1 p-2">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>
            `
        }
    }


    // ingredients html
    let ingredients = `
    <div class="col-md-4 my-5">
                    <img src="${meal.strMealThumb}" class="w-100 rounded-2" alt=""/>
                    <h2 class="mt-1">${meal.strMeal}</h2>
                </div>
                <div class="col-md-8 my-5">
                    <h3 class="h2">Instructions</h3>
                    <p>${meal.strInstructions}</p>
                    <h4><span class="fs-3 fw-bolder"> Area : </span> ${meal.strArea}</h4>
                    <h4> <span class="fs-3 fw-bolder">Category : </span> ${meal.strCategory}</h4>
                    <h4>Recipes :</h4>
                    <ul class="ps-0 d-flex flex-wrap g-3">
                        ${mealIngredients}
                    </ul>
                    <h4>Tags :</h4>
                    <ul class="ps-0 d-flex flex-wrap g-3">
                        ${Tag}
                    </ul>
                    <a href="${meal.strSource}" target="_blank" class="btn btn-success">Source</a>
                    <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger">Youtube</a>
                </div>
    `
    dataEl.innerHTML = ingredients;
}

// ! Display Search Inputs
function showSearchInputs(){
    dataEl.innerHTML = ``

    searchInputsEl.innerHTML = `
    <div class="row">
        <div class="col-md-6">
            <input onkeyup="searchByName(this.value)" type="text" class="form-control bg-transparent text-white" placeholder="Search By Name"/>
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFristLetter(this.value)" type="text" class="form-control bg-transparent text-white" maxlength="1" placeholder="Search By Frist Letter"/>
        </div>
    </div>
`
}

// ~ Search By Name
function searchByName(mealName){
    closeSideNav();
    dataEl.innerHTML = ``;

    $('.loading').fadeIn(500, async function(){

        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
        let data = await response.json();
        let meal = data.meals;

        displayMeals(meal)

        $('.loading').fadeOut(500)
    });
}
// searchByName('Corba')

function searchByFristLetter(fLetter){
    closeSideNav();
    dataEl.innerHTML = ``;

    $('.loading').fadeIn(500, async function(){

        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${fLetter}`);
        let data = await response.json();
        let meals = data.meals;

        displayMeals(meals)
        $('.loading').fadeOut(500)
    })
}
// searchByFristLetter('c')

// ^ Get Categories
function getCategories(){
    closeSideNav();
    dataEl.innerHTML = ``;

    $('.loading').fadeIn(500, async function(){

        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        let data = await response.json();
        let categories = data.categories;

        displayCategories(categories);

        $('.loading').fadeOut(500);
    })
}

function displayCategories(list){
    let newCategory = ``

    for (let i = 0; i < list.length; i++) {
        newCategory += `
        <div class="col-md-3">
                    <div onclick="getMealsInTheCategory('${list[i].strCategory}')" class="meal position-relative rounded-2 overflow-hidden cursor-pointer">
                        <img src="${list[i].strCategoryThumb}" class="w-100 " alt=""/>
                        <div class="layer p-1 text-black position-absolute text-center">
                            <h3>${list[i].strCategory}</h3>
                            <p>${list[i].strCategoryDescription}</p>
                        </div>
                    </div>
        </div>
        `
    }
    dataEl.innerHTML = newCategory;
}


// * Get Meals In The Category
function getMealsInTheCategory(category){
    dataEl.innerHTML = ``;

    $('.loading').fadeIn(500, async function(){

        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        let data = await response.json();
        let meal = data.meals;

        displayMeals(meal.slice(0, 20));

        $('.loading').fadeOut(500);
    })
}
// getMealsInTheCategory('Beef')


// ! Get Areas
function getArea(){
    closeSideNav();
    dataEl.innerHTML = ``;

    $('.loading').fadeIn(500, async function(){

        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
        let data = await response.json();
        let areas = data.meals

        displayAreas(areas);
        $('.loading').fadeOut(500);
    })
}

function displayAreas(list){
    let newArea = ``;

    for (let i = 0; i < list.length; i++) {
        newArea += `
        <div onclick="getMealsInTheArea('${list[i].strArea}')" class="col-md-3">
            <div class="cursor-pointer text-center">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3>${list[i].strArea}</h3>
                </div>
        </div>
        `
    }

    dataEl.innerHTML = newArea;
}


// ^ Get Meals In The Area
function getMealsInTheArea(area){
    dataEl.innerHTML = ``;

    $('.loading').fadeIn(500, async function(){

        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        let data = await response.json();
        let meal = data.meals;

        displayMeals(meal.slice(0, 20));
        $('.loading').fadeOut(500);
    })
}

// & Get Ingredients
function getIngredients(){
    closeSideNav();
    dataEl.innerHTML = ``;

    $('.loading').fadeIn(500, async function(){

        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
        let data = await response.json();
        let ingredient = data.meals.slice(0, 20);

        displayIngredients(ingredient);
        $('.loading').fadeOut(500);
    })
}

function displayIngredients(list){
    let newIngredient = ``;

    for (let i = 0; i < list.length; i++) {
        newIngredient += `
        <div class="col-md-3">
            <div onclick="getMealInTheIngredient('${list[i].strIngredient}')" class="cursor-pointer text-center">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${list[i].strIngredient}</h3>
                <p>${list[i].strDescription.split(' ').slice(0, 15).join(' ')}</p>
            </div>
        </div>
        `
    }
    dataEl.innerHTML = newIngredient
}


// ~ Get Meal In The Ingredient
function getMealInTheIngredient(ingredient){
    dataEl.innerHTML = ``;

    $('.loading').fadeIn(500, async function(){

        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        let data = await response.json();
        let meal = data.meals.slice(0, 20);

        displayMeals(meal);
        $('.loading').fadeOut(500);
    })
}


// ! Display Contact Form
function displayContactForm(){

    dataEl.innerHTML = `
    <div class="contact d-flex justify-content-center align-items-center min-vh-100">
                    <div class="container w-75 text-center">
                        <div class="row g-2">
                            <div class="col-md-6">
                                <input onkeyup="inputsValidation()" id="name" type="text" class="form-control" placeholder="Enter Your Name"/>
                                <div id="name-alert" class="alert alert-danger d-none mt-1">
                                    Special characters and numbers not allowed
                                </div>
                            </div>
                            <div class="col-md-6">
                                <input onkeyup="inputsValidation()" id="email" type="email" class="form-control" placeholder="Enter Your Email"/>
                                <div id="email-alert" class="alert alert-danger d-none mt-1">
                                    Email not valid *exemple@yyy.zzz
                                </div>
                            </div>
                            <div class="col-md-6">
                                <input onkeyup="inputsValidation()" id="phone" type="tel" class="form-control" placeholder="Enter Your Phone"/>
                                <div id="phone-alert" class="alert alert-danger d-none mt-1">
                                    Enter valid Phone Number
                                </div>
                            </div>
                            <div class="col-md-6">
                                <input onkeyup="inputsValidation()" id="age" type="number" class="form-control" placeholder="Enter Your Age"/>
                                <div id="age-alert" class="alert alert-danger d-none mt-1">
                                    Enter valid age
                                </div>
                            </div>
                            <div class="col-md-6">
                                <input onkeyup="inputsValidation()" id="password" type="password" class="form-control" placeholder="Enter Your Password"/>
                                <div id="password-alert" class="alert alert-danger d-none mt-1">
                                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                                </div>
                            </div>
                            <div class="col-md-6">
                                <input onkeyup="inputsValidation()" id="repassword" type="password" class="form-control" placeholder="Repassword"/>
                                <div id="repassword-alert" class="alert alert-danger d-none mt-1">
                                    Enter valid repassword
                                </div>
                            </div>
                        </div>
                        <button id="submit" disabled="true" class="btn btn-outline-danger my-4">Submit</button>
                    </div>
                </div>
    `

    document.getElementById('name').addEventListener('focus',nameValidation);
    document.getElementById('email').addEventListener('focus',emailValidation);
    document.getElementById('phone').addEventListener('focus',phoneValidation);
    document.getElementById('age').addEventListener('focus',ageValidation);
    document.getElementById('password').addEventListener('focus',passwordValidation);

    let submitBtn = document.querySelector('submit');

    if(nameValidation && emailValidation && phoneValidation && ageValidation && passwordValidation && repasswordValidation){
        submitBtn.removeAttribute('disabled')
    }
    else{
        submitBtn.setAttribute('disabled', true)
    }
}

// ^ Name Input REGEX and Validation
function nameValidation(){

    const nameREGEX = /^[a-zA-Z\s]+$/;
    const nameInput = document.getElementById('name');

    if(nameREGEX.test(nameInput.value) === false){
        $('#name-alert').removeClass('d-none');
        $('#name-alert').addClass('d-block');
        return false;
    }
    else{
        $('#name-alert').removeClass('d-block');
        $('#name-alert').addClass('d-none');
        return true;
    }
}

// * Email Input REGEX and Validation
function emailValidation(){

    const mailREGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailInput = document.getElementById('email');

    if(mailREGEX.test(emailInput.value) === false){
        $('#email-alert').removeClass('d-none');
        $('#email-alert').addClass('d-block');
        return false;
    }
    else{
        $('#email-alert').removeClass('d-block');
        $('#email-alert').addClass('d-none');
        return true;
    }
}

// & Phone Input REGEX and Validation
function phoneValidation(){

    const phoneREGEX = /^(?:(?:\+|00)20)?0(10|11|12|15)[0-9]{8}$/;
    const phoneInput = document.getElementById('phone');

    if(phoneREGEX.test(phoneInput.value) === false){
        $('#phone-alert').removeClass('d-none');
        $('#phone-alert').addClass('d-block');
        return false;
    }
    else{
        $('#phone-alert').removeClass('d-block');
        $('#phone-alert').addClass('d-none');
        return true;
    }
}

// ! Age Input REGEX and Validation
function ageValidation(){

    const ageREGEX = /^(1[0-9]|[1-8][0-9]|9[0])$/;
    const ageInput = document.getElementById('age');

    if(ageREGEX.test(ageInput.value) === false){
        $('#age-alert').removeClass('d-none');
        $('#age-alert').addClass('d-block');
        return false;
    }
    else{
        $('#age-alert').removeClass('d-block');
        $('#age-alert').addClass('d-none');
        return true;
    }
}

// ^ Password Input REGEX and Validation
function passwordValidation(){

    const passwordREGEX = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+{}|[\]\\:;'",.<>?/`~\-=]{8,}$/;
    const passwordInput = document.getElementById('password');

    if(passwordREGEX.test(passwordInput.value) === false){
        $('#password-alert').removeClass('d-none');
        $('#password-alert').addClass('d-block');
        return false;
    }
    else{
        $('#password-alert').removeClass('d-block');
        $('#password-alert').addClass('d-none');
        return true;
    }
}

// ~ RePassword Input REGEX and Validation
function repasswordValidation(){

    const repasswordInput = document.getElementById('repassword');
    const passwordInput = document.getElementById('password');

    if(passwordInput.value === repasswordInput.value){
        $('#repassword-alert').removeClass('d-block');
        $('#repassword-alert').addClass('d-none');
        return true;
    }
    else{
        $('#repassword-alert').removeClass('d-none');
        $('#repassword-alert').addClass('d-block');
        return false;
    }
}

// & Validate All Inputs
function inputsValidation(){
    nameValidation();
    emailValidation();
    phoneValidation();
    ageValidation();
    passwordValidation();
    repasswordValidation();
}

// * Events
searchBtn.addEventListener('click', () =>{
    closeSideNav();
    showSearchInputs();
})

categoryBtn.addEventListener('click',() => {
    closeSideNav();
    getCategories();
})

areaBtn.addEventListener('click', () =>{
    closeSideNav();
    getArea();
})

ingredientBtn.addEventListener('click', () =>{
    closeSideNav();
    getIngredients();
})

contactBtn.addEventListener('click',() =>{
    closeSideNav();
    displayContactForm();
})
