// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract TarsReports {
    enum Status { Pending, Verified, Flagged }

    struct Report {
        address reporter;
        string cid;
        uint256 timestamp;
        Status status;
    }

    Report[] public reports;
    mapping(string => uint256) private cidToIndex;
    mapping(string => bool) private cidExists;

    event ReportSubmitted(uint256 indexed index, address indexed reporter, string cid, uint256 timestamp, Status status);
    event ReportStatusUpdated(uint256 indexed index, string cid, Status status);

    function submitReport(string calldata cid, uint256 timestamp) external returns (uint256) {
        require(!cidExists[cid], "CID already submitted");

        reports.push(Report({
            reporter: msg.sender,
            cid: cid,
            timestamp: timestamp,
            status: Status.Pending
        }));

        uint256 index = reports.length - 1;
        cidToIndex[cid] = index;
        cidExists[cid] = true;

        emit ReportSubmitted(index, msg.sender, cid, timestamp, Status.Pending);
        return index;
    }

    function getReportCount() external view returns (uint256) {
        return reports.length;
    }

    function getReport(uint256 index) external view returns (address reporter, string memory cid, uint256 timestamp, Status status) {
        require(index < reports.length, "Index out of range");
        Report storage r = reports[index];
        return (r.reporter, r.cid, r.timestamp, r.status);
    }

    function getReportByCid(string calldata cid) external view returns (address reporter, string memory _cid, uint256 timestamp, Status status) {
        require(cidExists[cid], "CID not found");
        uint256 idx = cidToIndex[cid];
        Report storage r = reports[idx];
        return (r.reporter, r.cid, r.timestamp, r.status);
    }

    function updateStatus(string calldata cid, Status newStatus) external returns (uint256) {
        require(cidExists[cid], "CID not found");
        uint256 idx = cidToIndex[cid];
        reports[idx].status = newStatus;
        emit ReportStatusUpdated(idx, cid, newStatus);
        return idx;
    }
}
