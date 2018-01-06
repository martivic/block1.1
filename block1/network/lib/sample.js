/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
 var orderStatus={
	 Created: {code: 1, text: 'Order Created'},
	 Bought: {code: 2, text: 'Order Bought and Purchased'},
	 Cancelled: {code:3, text: 'Order Cancelled'},
	 Ordered: {code:4, text: 'Order Submitted to Supplier Provider'},
	 ShipRequest: {code:5, text: 'Shipping Requested'},
	 Delivered: {code:6, text: 'Order Delivered'},
	 Delivering: {code:15, text: 'Order Being Delivered in Route'},
	 Backordered: {code:7, text: 'Order Backordered'},
	 Dispute: {code:8, text: 'Order in Dispute'},
	 Resolve: {code:9, text: 'Order Dispute Resolved'},
	 PayRequest: {code:10, text: 'Payment Request'},
	 Authorize: {code:11, text: 'Payment Approved and Authorized'},
	 Paid: {code:14, text: 'Payment Processed'},
	 Refund: {code:12, text: 'Order Refund Requested'},
	 Refunded: {code:3, text: 'Order Refunded'},
 }
 
 /**create an order to purchase 
 * @param {org.dotbox.caregiverNetwork.CreateOrder} purchase
 * @transaction
 */
 
 function CreateOrder(purchase) {
	 purchase.order.buyer = purchase.buyer;
	 purchase.order.amount = purchase.amount;
	 purchase.order.financeCo = purchase.financeCo;
	 purchase.order.created = new Date().toISOString();
	 purchase.order.status = JSON.stringify(orderStatus.Created);
	 return getAssetRegistry ('org.dotbox.caregiverNetwork.Order')
	    .then(function (assetRegistry){
			return assetRegistry.update(purchase.order);
		});
 }
 
/**Record a request to purchase 
 * @param {org.dotbox.caregiverNetwork.Buy} purchase
 * @transaction
 */ 
 function Buy(purchase) {
	 if (purchase.order.status = JSON.stringify(OrderStatus.Created))
	 {
		 purchase.order.buyer = purchase.buyer;
		 purchase.order.seller = purchase.seller;
		 purchase.order.bought = new Date().toISOString();
		 purchase.order.status = JSON.stringify(orderStatus.Bought);
		 return getAssetRegistry('org.dotbox.caregiverNetwork.Order')
			.then(function (assetRegistry){
				return assetRegistry.update(purchase.order);
	 });
	 }
 }
/**record a request to cancel an order 
@param (org.dotbox.caregiverNetwork.OrderCancel) purchase
 @transaction

 */ 
  function OrderCancel(purchase) {
	 if ((purchase.order.status = JSON.stringify(orderStatus.Created)) || (purchase.order.status = JSON.stringify(orderStatus.Bought)))
	 {
		 purchase.order.buyer = purchase.buyer;
		 purchase.order.seller = purchase.seller;
		 purchase.order.cancelled = new Date().toISOString();
		 purchase.order.status = JSON.stringify(orderStatus.Cancelled);
		 return getAssetRegistry('org.dotbox.caregiverNetwork.Order')
			.then (function (assetRegistry){
				return assetRegistry.update(purchase.order);
			});
	 }
 }
 
 /**record a request to Order by seller from supplier 
@param (org.dotbox.caregiverNetwork.OrderFromSupplier) purchase
 @transaction
 */ 
 
 function OrderFromSupplier(purchase) {
	 if (purchase.order.status = JSON.stringify(orderStatus.Bought))
	 {
		 purchase.order.provider = purchase.provider;
		 purchase.order.ordered = new Date().toISOString();
		 purchase.order.status = JSON.stringify(orderStatus.Ordered);
		 return getAssetRegistry('org.dotbox.caregiverNetwork.Order')
			.then(function (assetRegistry){
				return assetRegistry.update(purchase.order);
			});
	 }
 }
  /**record a request to ship by supplier to shipper 
@param (org.dotbox.caregiverNetwork.RequestShipping) purchase
 @transaction
 */ 
function RequestShipping(purchase) {
	if (purchase.order.status = JSON.stringify(orderStatus.Ordered))
	{
		purchase.order.shipper = purchase.shipper;
		purchase.order.requestShipment = new Date().toISOString();
		purchase.order.status = JSON.stringify(orderStatus.ShipRequest);
		return getAssetRegistry('org.dotbox.caregiverNetwork.order')
			.then(function(assetRegistry){
				return assetRegistry.update(purchase.order);
			});
	}
}
/**record a delivery by shipper 
@param (org.dotbox.caregiverNetwork.Delivering) purchase
 @transaction

 */ 
function Delivering(purchase) {
	if ((purchase.order.status = JSON.stringify(orderStatus.ShipRequest)) || (JSON.parse(purchase.order.status).code = orderStatus.Delivering.code))
	{
		purchase.order.delivering = new Date().toISOString();
		var _status = orderStatus.Delivering;
		_status.text += ' '+purchase.deliveryStatus;
		purchase.order.status = JSON.stringify(_status);
		return getAssetRegistry('org.dotbox.caregiverNetwork.Order')
		.then(function (assetRegistry) {
			return assetRegistry.update(purchase.order);
		});
	}		
}
/**record a deliver by shipper 

@param (org.dotbox.caregiverNetwork.Deliver) purchase
 @transaction
 */ 

function Deliver(purchase) {
	if ((purchase.order.status = JSON.stringify(orderStatus.ShipRequest)) || (JSON.parse(purchase.order.status).code = orderStatus.Delivering.code))
	{
		purchase.order.delivered = new Date().toISOString();
		purchase.order.status = JSON.stringify(orderStatus.Delivered);
		return getAssetRegistry('org.dotbox.caregiverNetwork.Order')
			.then(function(assetRegistry){
				return assetRegistry.update(purchase.order);
			});
	}	
}
/**record a request for payment by seller  
@param (org.dotbox.caregiverNetwork.RequestPayment) purchase
 @transaction
  */ 
 function RequestPayment(purchase) {
	 if((JSON.parse(purchase.order.status).text == orderStatus.Delivered.text) || (JSON.parse(purchase.order.status).ext == orderStatus.Resolve.text))
	 {purchase.order.status = JSON.stringify(orderStatus.PayRequest);
	  purchase.order.financeCo = purchase.financeCo;
	  purchase.order.paymentRequested = new Date().toISOString();		 
	 }
	 return getAssetRegistry('org.dotbox.caregiverNetwork.Order')
		.then(function(assetRegistry) {
			return assetRegistry.update(purchase.order);
		});
 }
  /**record a payment to seller 
@param (org.dotbox.caregiverNetwork.AuthorizePayment) purchase
 @transaction
 
 */ 
function AuthorizePayment(purchase) {
	if ((JSON.parse(purchase.order.status).text == orderStatus.PayRequest.text) || (JSON.parse(purchase.order.status).text == orderStatus.Resolve.text))
	{purchase.order.status = JSON.stringify(orderStatus.Authorize);
	 purchase.order.approved = new Date().toISOString();
	}
return getAssetRegistry('org.dotbox.caregiverNetwork.Order')
	.then(function(assetRegistry) {
		return assetRegistry.update(purchase.order);
	});
}

/**record a payment to the seller 
@param (org.dotbox.caregiverNetwork.Pay) purchase
 @transaction
 */ 
function Pay(purchase) {
	if (JSON.parse(purchase.order.status).text == orderStatus.Authorize.text )
	{purchase.order.status = JSON.stringify(orderStatus.Paid);
	 purchase.order.paid = new Date().toISOString();
	 }
	return getAssetRegistry('org.dotbox.caregiverNetwork.Order')
		.then(function (assetRegistry) {
			return assetRegistry.update(purchase.order);
		});
	}
  /**record a dispute by buyer 
@param (org.dotbox.caregiverNetwork.Dispute) purchase
 @transaction
 */ 
 
 function Dispute(purchase) {
	 purchase.order.status = JSON.stringify(orderStatus.Dispute);
	 purchase.order.dispute = purchase.dispute;
	 purchase.order.disputeOpened = new Date().toISOString();
	return getAssetRegistry('org.dotbox.caregiverNetwork.Order')
		.then(function(assetRegistry) {
			return assetRegistry.update(purchase.order);
		});
 }
 
 /**resolve a seller initiated dispute 
@param (org.dotbox.caregiverNetwork.Resolve) purchase
 @transaction
 */ 
  function Resolve(purchase) {
	 purchase.order.status = JSON.stringify(orderStatus.Resolve);
	 purchase.order.resolve = purchase.resolve;
	 purchase.order.disputeResolved = new Date().toISOString();
	return getAssetRegistry('org.dotbox.caregiverNetwork.Order')
		.then(function(assetRegistry) {
			return assetRegistry.update(purchase.order);
		});
 }
 /**record a refund to buyer 
@param (org.dotbox.caregiverNetwork.Refund) purchase
 @transaction
 */
 
function Refund(purchase) {
	purchase.order.status = JSON.stringify(orderStatus.Refund);
	purchase.order.refund = purchase.refund;
	purchase.order.orderRefunded = new Date().toISOString;
return getAssetRegistry('org.dotbox.caregiverNetwork.Order')
	.then(function(assetRegistry) {
		return assetRegistry.update(purchase.order);
	});
}
  /**record a backorder by  supplier 
@param (org.dotbox.caregiverNetwork.BackOrder) purchase
 @transaction
 */ 
  
 function BackOrder(purchase) {
	 purchase.order.status = JSON.stringify(orderStatus.BackOrdered);
	 purchase.order.backorder = purchase.backorder;
	 purchase.order.dateBackordered = new Date().toISOString();
	 purchase.order.provider = purchase.provider;
		return getAssetRegistry('org.dotbox.caregiverNetwork.Order')
		.then(function(assetRegistry) {
			return getAssetRegistry.update(purchase.order);
		});
 }
 