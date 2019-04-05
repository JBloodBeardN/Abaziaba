var inquirer = require('inquirer');
var mysql = require('mysql');
var consoleTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "remoteConnect",
    password: "TEST",
    database: "abaziaba_db"
});

connection.connect(function (err) {
    if (err) throw err;
    displayCatalog();
})
//   //display all items from database products table (in table(id/name/price/qty) >> using console.table npm package)
// //connection.query(SELECT WHERE…)
// //NEW console.table npm package NEW//

function displayCatalog() {
    connection.query("SELECT * FROM products", function (err, data) {
        if (err) throw err;
        var newTable = consoleTable.getTable(data);
        console.log(newTable);
        // console.log(data.length);
        checkout(data.length, data);

    });
}
// // inquirer
// //inquirer.prompt ().then()
// //.validate()????? For must be a number equal to the number of items in the table printed through console.table
// THIS IS SIMILAR TO THE SOLUTION ERIC SHOWED FOR GREATBAY inClassActivity
// --look for isNaN for quantity must be a number
// If console.table takes an array- we can use array.length for the validation check  where 0 > inquirerAnswer > array.length

function checkout(maxValue, tableObject) {
    var price = 0;
    var stockQuantity = 0;
    var selectedProduct;
    //    // prompt "Which item would you like to buy"
    //    // prompt "How many would you like"
    // //question? [Type ‘Q’ to Quit]. << not in instructions, but how does //program end if we recall wouldYouLikeToBuy()
    inquirer.prompt([
        {
            name: "productSelect",
            message: "Select a product by ID to purchase:",
            validate: function (value) {
                if ((isNaN(value) == true) && (value > maxValue) && (value < 0)) {
                    //if is notANum
                    //if value is greater than the max
                    //if value is less than zero
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(function (answer) {
        inquirer.prompt([
            {
                name: "quantityToPurchase",
                message: "How much would you like to purchase?",
                validate: function (value) {
                    // //read value of selection based on number input used as index of the array passed to console.table (array[response.itemSelected].itemId)
                    tableObject.forEach(function (element, index) {
                        if (element.itemId == answer.productSelect) {
                            selectedProduct = element;
                            stockQuantity = parseInt(element.stockQuantity);
                            price = parseFloat(element.price);
                        };
                    })
                    if (value > stockQuantity) {
                        console.log(`
                        Insufficient Stock Quantity.`);
                        return false;
                    } else {
                        return true;
                    };

                }
            }
        ]).then(function (answer) {
            const quantityToPurchase = parseInt(answer.quantityToPurchase);
            const newQuantity = stockQuantity - quantityToPurchase;
            const cost = quantityToPurchase * price;
            connection.query("UPDATE products SET stockquantity = ? WHERE itemId = ?", [newQuantity, selectedProduct.itemId], function (err, data) {
                if (err) throw err;
                console.log(
                    `You Purchased ${quantityToPurchase} ${selectedProduct.productName}
Your purchase cost ${cost}.
                    `);
                inquirer.prompt([
                    {
                        type: "confirm",
                        message: "Are you finished shopping?",
                        name: "shopAgain"
                    }
                ]).then(function (answer) {
                    if (answer.shopAgain) {
                        console.log("Thank you for shopping with us today.")
                        connection.end();
                    } else {
                        displayCatalog();
                    }
                })
            })
        })
    });

}



//    // read data from the table
//        // if customerQuantity <= inventory then allow the sale
//            // update SQL Database to reflect current inventory
// //^ probably its own function (purchase(itemId, quantity);

//            // show the total cost of their purchase
//                // ParseFloat ( total = itemCost * customer Quantity )
// 			//print success message with total cost of purchase
//        // else
//            // log `Insufficient quantity!`
//            // prevent order from going through
//            // offer option to buy what's available
// 		//if buy whats available>>>
// 		// calls purchase() with parameters (itemId, qty as recieved from database query)

// //else just recall the function

// In both cases - reprompt with print updated table, prompt wouldYouLikeToBuy(); 

