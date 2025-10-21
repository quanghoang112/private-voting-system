import React, { useEffect, useState, useCallback } from "react";
import { votingContractAddress,votingABI } from "../utils/constants";
import{getEthereumContract,deployZKVotingContract} from "../context/TransactionContext"
import { ethers } from "ethers";

type VoteResultsProps = {
    addressVotingContract?: string,
    roomId?: string, // nếu cần xác định phòng
    voteOptions: number,
    autoFetch?: boolean,
};

const FIVE_SECONDS = 5 * 1000;

const VoteResults: React.FC<VoteResultsProps> = ({ addressVotingContract, roomId,voteOptions, autoFetch = false }) => {
  const [results, setResults] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        console.log("addressVotingContract: ", addressVotingContract);
        
        const contract = await getEthereumContract(addressVotingContract,votingABI); // trả về contract đã connect
        // const optionCountBN = await contract.getVotingOptionsCount();
        // const optionCount = Number(optionCountBN);

        // console.log("optionCount: ",optionCountBN);

        const tmp: number[] = [];
        for (let i = 1; i <= voteOptions; i++) {
            const c = await contract.getVoteCount(i);
            tmp.push(Number(c));
        }

        setResults(tmp);
        setLastUpdated(Date.now());
    } catch (e: any) {
        console.error("fetchResults error", e);
        setError(e?.message || "Lỗi khi lấy kết quả");
    } finally {
        setLoading(false);
    }
  }, []);

  // Auto fetch khi mount nếu muốn
  useEffect(() => {
        if (autoFetch) fetchResults();
  }, [autoFetch, fetchResults]);

  // Tự động refresh nhỏ (tuỳ chọn), nếu muốn bật để cập nhật live
  useEffect(() => {
        const interval = setInterval(() => {
      // chỉ refresh khi không đang load
        if (!loading) fetchResults();
        }, FIVE_SECONDS);
        return () => clearInterval(interval);
  }, [fetchResults, loading]);

  const totalVotes = results.reduce((s, v) => s + v, 0);

  return (
    <div className="vote-results p-4 bg-[#0f1724] rounded-md border border-[#24324f] text-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">📊 Kết quả kiểm phiếu</h3>
        <div className="text-sm text-gray-300">
          {lastUpdated ? `Cập nhật: ${new Date(lastUpdated).toLocaleTimeString()}` : "Chưa cập nhật"}
        </div>
      </div>

      <div className="mb-3">
        {loading ? (
          <div className="text-sm">⏳ Đang tải kết quả...</div>
        ) : error ? (
          <div className="text-sm text-red-400">⚠️ {error}</div>
        ) : results.length === 0 ? (
          <div className="text-sm text-gray-300">Chưa có dữ liệu kiểm phiếu.</div>
        ) : (
          <ul className="space-y-2">
            {results.map((count, idx) => (
              <li key={idx} className="flex justify-between">
                <span className="font-medium">Lựa chọn {idx+1}</span>
                <span>{count} phiếu</span>
              </li>
            ))}
            <li className="flex justify-between border-t border-dashed pt-2 mt-2">
              <span className="font-semibold">Tổng</span>
              <span className="font-semibold">{totalVotes} phiếu</span>
            </li>
          </ul>
        )}
      </div>

      <div className="flex flex-col items-between justify-center">
        <button
          onClick={fetchResults}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white disabled:opacity-60"
        >
          🔄 Làm mới
        </button>

        {/* <button
          onClick={() => {
            // bạn có thể chuyển trang kiểm phiếu ở đây nếu cần
            // ví dụ: router.push(`/room/${roomId}/results`)
          }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
        >
          🔍 Xem chi tiết
        </button> */}
      </div>
    </div>
  );
};

export default VoteResults;