"use strict";

const logoutButton = new LogoutButton();

logoutButton.action = function () {
  ApiConnector.logout(response => {
    if (response.success) {
      location.reload();
    } else {
      console.log(response.error);
    }
  });
};

ApiConnector.current(response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

const ratesBoard = new RatesBoard();

ratesBoard.getCurrency = function () {
  ApiConnector.getStocks(response => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  })
};

ratesBoard.getCurrency();
const getCurrencyIntervalId = setInterval(ratesBoard.getCurrency, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = function (data) {
  ApiConnector.addMoney(data, response => {
    this.showResultQuery(response, 'Баланс успешно пополнен!');
  });
};

moneyManager.conversionMoneyCallback = function (data) {
  ApiConnector.convertMoney(data, response => {
    this.showResultQuery(response, 'Валюта успешно конвертирована!');
  });
};

moneyManager.sendMoneyCallback = function (data) {
  ApiConnector.transferMoney(data, response => {
    this.showResultQuery(response, 'Валюта успешно переведена!');
  });
};

moneyManager.showResultQuery = function (response, message) {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  } else {
    message = response.error;
  }

  this.setMessage(response.success, message);
};

const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
  if (response.success) {
    favoritesWidget.showResultQuery(response, 'Список загружен!');
  }
});

favoritesWidget.addUserCallback = function (data) {
  ApiConnector.addUserToFavorites(data, response => {
    this.showResultQuery(response, 'Пользователь успешно добавлен!');
  });
};

favoritesWidget.removeUserCallback = function (data) {
  ApiConnector.removeUserFromFavorites(data, response => {
    this.showResultQuery(response, 'Пользователь удален!');
  });
}

favoritesWidget.showResultQuery = function (response, message) {
  if (response.success) {
    this.clearTable();
    this.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  } else {
    message = response.error;
  }

  this.setMessage(response.success, message);
}