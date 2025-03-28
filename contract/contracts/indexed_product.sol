// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.24;

contract indexed_id_product {

    event indexed_id_product_event(int256 indexed id, string data);

    function indexed_id_product_function(int256 id, string memory data) public {
        emit indexed_id_product_event(id, data);
    }
}