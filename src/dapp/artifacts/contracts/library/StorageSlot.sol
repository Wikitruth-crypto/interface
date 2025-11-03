// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity ^0.8.24;

library StorageSlot {
    struct AddressSlot {
        address value;
    }

    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }
}

// library StorageSlot {
//     struct AddressSlot {
//         address value;
//     }

//     function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
//         /// @solidity memory-safe-assembly
//         assembly {
//             r.slot := slot
//         }
//     }
// }
