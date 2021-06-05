/*

██╗  ░██╗░░░░░░░██╗██╗██╗░░░░░██╗░░░░░  ███████╗██╗░░░██╗░█████╗░██╗░░██╗██╗███╗░░██╗░██████╗░
██║  ░██║░░██╗░░██║██║██║░░░░░██║░░░░░  ██╔════╝██║░░░██║██╔══██╗██║░██╔╝██║████╗░██║██╔════╝░
██║  ░╚██╗████╗██╔╝██║██║░░░░░██║░░░░░  █████╗░░██║░░░██║██║░░╚═╝█████═╝░██║██╔██╗██║██║░░██╗░
██║  ░░████╔═████║░██║██║░░░░░██║░░░░░  ██╔══╝░░██║░░░██║██║░░██╗██╔═██╗░██║██║╚████║██║░░╚██╗
██║  ░░╚██╔╝░╚██╔╝░██║███████╗███████╗  ██║░░░░░╚██████╔╝╚█████╔╝██║░╚██╗██║██║░╚███║╚██████╔╝
╚═╝  ░░░╚═╝░░░╚═╝░░╚═╝╚══════╝╚══════╝  ╚═╝░░░░░░╚═════╝░░╚════╝░╚═╝░░╚═╝╚═╝╚═╝░░╚══╝░╚═════╝░

██████╗░░█████╗░  ██╗████████╗██╗
██╔══██╗██╔══██╗  ██║╚══██╔══╝██║
██║░░██║██║░░██║  ██║░░░██║░░░██║
██║░░██║██║░░██║  ██║░░░██║░░░╚═╝
██████╔╝╚█████╔╝  ██║░░░██║░░░██╗
╚═════╝░░╚════╝░  ╚═╝░░░╚═╝░░░╚═╝

*/

pragma solidity 0.8.4;

contract DoIt {
    struct Promise {
        uint256 promiseId;
        string promiseTask;
        uint256 promiseAmount;
        address payable creator;
        address payable friend;
        uint256 endTime;
        bool isFulfilled;
    }
    
    struct User {
        uint256 lockedFunds;
        uint256[] userPromisesList;
        uint256[] promisesToBeFulfilledByUserList;
        mapping(uint256 => uint256) userPromisesListMapping;
        mapping(uint256 => uint256) promisesToBeFulfilledByUserListMapping;
    }
    
    Promise[] promises;
    
    mapping(address => User) users;
    
    event PromiseCreated(string promiseTask, uint256 promiseAmount, address payable friend, uint256 id);
    event PromiseFulfilled(address fulfiller, address fundReceiver);
    
    address owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    function getlockedFunds() external view returns(uint256) {
        return users[msg.sender].lockedFunds;
    }
    
    function getPendingPromise(uint256 id) external view returns(Promise memory){
        return promises[id];
    }
    
    function getPendingPromises() external view returns(uint256[] memory) {
        return users[msg.sender].userPromisesList;
    }
    
    
    function getPromisesToBeFulfilled() external view returns(uint256[] memory) {
        return users[msg.sender].promisesToBeFulfilledByUserList;
    }
    
    function createPromise(string calldata promiseTask, uint256 promiseAmount, address payable friend, uint256 endTime) external payable {
        require(msg.value == promiseAmount, "Please send the correct amount of funds.");
        promises.push(Promise(promises.length, promiseTask, promiseAmount, payable(msg.sender), friend, endTime,  false));
        uint256 id = promises.length - 1;
        users[msg.sender].userPromisesList.push(id);
        users[msg.sender].userPromisesListMapping[id] = users[msg.sender].userPromisesList.length - 1;
        users[msg.sender].lockedFunds += promiseAmount;
        users[friend].promisesToBeFulfilledByUserList.push(id);
        users[friend].promisesToBeFulfilledByUserListMapping[id] = users[friend].promisesToBeFulfilledByUserList.length - 1;
        emit PromiseCreated(promiseTask, promiseAmount, friend, id);
    }
    
    function fulfillPromise(uint256 id) external returns(bool) {
        require(block.timestamp >= promises[id].endTime || msg.sender != owner, "Owner of dapp cannot fulfill promise before endTime");
        require(msg.sender == promises[id].friend || msg.sender == owner, "Only the friend or owner of dapp can fulfill promise");
        uint256 transferAmount = promises[id].promiseAmount;
        address creator = promises[id].creator;
        uint256 idOfCreatorList = users[creator].userPromisesListMapping[id];
        delete users[creator].userPromisesListMapping[id];
        users[creator].userPromisesList[idOfCreatorList] = users[creator].userPromisesList[users[creator].userPromisesList.length - 1];
        users[creator].userPromisesListMapping[users[creator].userPromisesList[idOfCreatorList]] = idOfCreatorList;
        users[creator].lockedFunds -= transferAmount;
        users[creator].userPromisesList.pop();
        
        address friend;
        
        friend = msg.sender;
        uint256 idOfFriendList = users[friend].promisesToBeFulfilledByUserListMapping[id];
        delete users[friend].promisesToBeFulfilledByUserListMapping[id];
        users[friend].promisesToBeFulfilledByUserList[idOfFriendList] = users[friend].promisesToBeFulfilledByUserList[users[friend].promisesToBeFulfilledByUserList.length - 1];
        users[friend].promisesToBeFulfilledByUserListMapping[users[friend].promisesToBeFulfilledByUserList[idOfFriendList]] = idOfFriendList;            
        users[friend].promisesToBeFulfilledByUserList.pop();
        
        
        if(msg.sender == owner) {
            payable(owner).transfer(transferAmount);
        } else {
            payable(creator).transfer(transferAmount);    
        }
        promises[id].isFulfilled = true;
        
        if(msg.sender != owner) {
            emit PromiseFulfilled(friend, creator);    
        } else {
            emit PromiseFulfilled(owner, owner);
        }
        return true;
        
    }
    
    function getPromises() external view returns(uint256[] memory){
        // returns the promises with global id's
        return users[msg.sender].userPromisesList;
    }
}