; (function () {

    ka.register("order-details-viewmodel", [
        '$location', 
        'page-data', 
        'loading-modal', 
        'DataSource', 
        'Editor', 
        'message-box', 
        'toaster', 
        'seedorder-modal', 
        'seedorderdetail-modal', 
        'seedorderdiscount-modal', 
        'http',
        "inventoryadjustment-modal", 
        "transfersetup-modal"
        ],
        function OrderDetailsViewModel(
            $location, 
            pageData, 
            loadingModal, 
            DataSource, 
            Editor, 
            messageBox, 
            toaster, 
            soModal, 
            sodModal, 
            soDiscountModal, 
            http,
            inventoryadjustmentModal, 
            transferSetupModal) {
                
            var
                self = this;

            function init() {
                self.datasource = new DataSource(pageData || [], {
                    url: "/api/seedorder/details"
                });

                self.discounts(pageData.discounts || []);

                self.seedOrderId = pageData.id;
                self.clientId = pageData.clientId;
                self.cropYear = pageData.cropYear;
                self.name = pageData.name;
                self.orderNotes = pageData.orderNotes;
            }

            this.seedOrderId = null;
            this.clientId = null;
            this.cropYear = null;
            this.datasource = null;
            this.discounts = ko.observableArray();
            this.orderNotes = null;

            this.edit = function () {
                var so = {
                    id: self.seedOrderId,
                    clientId: self.clientId,
                    clientName: pageData.clientName,
                    cropYear: self.cropYear,
                    orderNumber: pageData.orderNumber,
                    orderDate: pageData.orderDate,
                    totalCornAcres: pageData.totalCornAcres,
                    totalSoybeanAcres: pageData.totalSoybeanAcres,
                    paymentDueOn: pageData.paymentDueOn,
                    orderNotes: pageData.orderNotes
                };

                return soModal.show({ seedOrder: so })
                .then(function () {
                    $location.reload();
                });
            };

            this.submit = function () {
                return messageBox.show("Are you finished and ready to submit this order?")
                .then(function (btn) {
                    if (btn == "Ok") {
                        return _submit();
                    }
                });
            };

            this.approve = function () {
                return messageBox.show("Are you finished and ready to approve this order?")
                .then(function (btn) {
                    if (btn == "Ok") {
                        return _approve();
                    }
                });
            };

            this.revise = function () {
                return messageBox.show({
                    header: "Revise or Replace?",
                    message: "Do you want to edit (Revise) this order or start with a blank order (Replace)?",
                    buttons: ["Cancel", "Revise", "Replace"]
                })
                .then(function (btn) {
                    if (btn == "Revise" || btn == "Replace") {
                        return _revise(btn);
                    }
                });
            };

            this.transfer = function () {
                return transferSetupModal.show({
                    seedOrderId: self.seedOrderId
                });
            };

            this.addDetail = function () {
                var sod = {};

                return self.editDetail(sod);
            };

            this.editDetail = function (sod) {

                sod.seedOrderId = self.seedOrderId;

                return sodModal.show({ seedOrderDetail: sod, clientId: self.clientId })
                .then(function () {
                    $location.reload();
                });
            };

            this.removeDetail = function (item) {
                return messageBox.show("Are you sure you want to clear this entry?")
                .then(function (btn) {
                    if (btn == "Ok") {
                        return _destroy(item);
                    }
                });
            };

            this.addDiscount = function () {
                var sod = {};

                return self.editDiscount(sod);
            };

            this.editDiscount = function (sod) {

                sod.seedOrderId = self.seedOrderId;

                return soDiscountModal.show({
                    seedOrderDiscount: sod,
                    cornUnits: pageData.totalOrderedCornUnits || 0,
                    soybeanUnits: pageData.totalOrderedSoybeanUnits || 0,
                    cornSubtotal: pageData.cornSubtotal || 0.0,
                    soybeanSubtotal: pageData.soybeanSubtotal || 0.0,
                    items: self.datasource.items()
                })
                .then(function () {
                    $location.reload();
                });
            };

            this.removeDiscount = function (item) {
                return messageBox.show("Are you sure you want to remove this discount?")
                .then(function (btn) {
                    if (btn == "Ok") {
                        return _destroyDiscount(item);
                    }
                });
            };

            this.adjustInventory = function (item) {
                return inventoryadjustmentModal.show({
                    seedOrderDetail: item
                })
                .then(function () {
                    $location.reload();
                });
            };

            this.search_Click = function () {
                return refresh();
            };

            function refresh() {
                return self.datasource.search({
                    id: self.seedOrderId
                });
            }

            function _submit() {
                loadingModal.show();

                return http.post("/api/seedorder/submit/" + self.seedOrderId)
                .always(loadingModal.hide)
                .then(function () {
                    toaster.success("Order Submitted!");
                    $location.reload();
                });
            }

            function _approve() {
                loadingModal.show();

                return http.post("/api/seedorder/approve/" + self.seedOrderId)
                .always(loadingModal.hide)
                .then(function () {
                    toaster.success("Order Approved!");
                    $location.reload();
                });
            }

            function _revise(reviseOption) {
                loadingModal.show();

                var newOrderId = null;

                return http.post("/api/seedorder/revise/" + self.seedOrderId, {
                    reviseType: (reviseOption == "Replace" ? 1 : 0)
                })
                .then(function (data) {
                    if (data) {
                        newOrderId = data;
                    }
                })
                .always(loadingModal.hide)
                .then(function () {
                    toaster.success("Order Marked for Revision!");

                    if (newOrderId) {
                        $location.href("/SeedOrders/Details/" + newOrderId);
                    }
                    else {
                        $location.reload();
                    }
                });
            }

            function _destroy(item) {
                var editor = new Editor(item, {
                    key: 'id',
                    url: "/api/seedorderdetail"
                });

                loadingModal.show();
                return editor.destroy()
                .then(function () {
                    toaster.success("Order Line Cleared!")
                })
                .always(loadingModal.hide)
                .then(function () {
                    $location.reload();
                });
            }

            function _destroyDiscount(item) {
                var editor = new Editor(item, {
                    key: 'id',
                    url: "/api/seedorderdiscount"
                });

                loadingModal.show();
                return editor.destroy()
                .then(function () {
                    toaster.success("Discount Removed!")
                })
                .always(loadingModal.hide)
                .then(function () {
                    $location.reload();
                });
            }

            init();
        }
    );

}());