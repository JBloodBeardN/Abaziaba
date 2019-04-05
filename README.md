# Abaziaba
CLI based storefront homework activity

link to screencastify video of User Experience: https://github.com/JBloodBeardN/Abaziaba/blob/master/Apr%205%2C%202019%2011_08%20AM.webm

includes mySQL database connection for pulling data and updating quantity levels after purchase.
includes inquirer npm package for CLI prompts.

System presents list of products from data
Allows user to select an item from the list for purchase (by itemId)
Allows user to input quantity of purchase desired
System decreases quantity by quantity purchased (if sufficient quantity)
System prints confirmation of purchase including productName, quantity purchased, and total cost (price * quantity)
System then asks user if they would like to continue shopping which repeats the process or exits
