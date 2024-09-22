'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import type { Agree } from '../../../types'; // 상대 경로로 변경

const policyOptions = [
  { value: "JOIN_TERMS_K", label: "이용약관 동의 (KOR)" },
  { value: "JOIN_TERMS_G", label: "이용약관 동의 (GLOBAL)" },
  { value: "JOIN_AGR_PRVACY_K", label: "개인정보수집 및 이용동의 (KOR)" },
  { value: "JOIN_AGR_PRVACY_G", label: "개인정보수집 및 이용동의 (GLOBAL)" },
  { value: "JOIN_AGR_PRVACY_M_K", label: "개인정보수집 및 이용동의(회원가입) (KOR)" },
  { value: "JOIN_AGR_PRVACY_M_G", label: "개인정보수집 및 이용동의(회원가입) (GLOBAL)" },
  { value: "JOIN_AGR_PRVACY_N_K", label: "개인정보수집 및 이용동의(뉴스레터) (KOR)" },
  { value: "JOIN_AGR_PRVACY_N_G", label: "개인정보수집 및 이용동의(뉴스레터) (GLOBAL)" },
  { value: "JOIN_AGR_PRVACY_Q_K", label: "개인정보수집 및 이용동의(문의하기) (KOR)" },
  { value: "JOIN_AGR_PRVACY_Q_G", label: "개인정보수집 및 이용동의(문의하기) (GLOBAL)" },
  { value: "JOIN_AGR_PRVACY_R_K", label: "개인정보수집 및 이용동의(채용공고)(KOR)" },
  { value: "JOIN_AGR_PRVACY_R_G", label: "개인정보수집 및 이용동의(채용공고)(GLOBAL)" },
  { value: "JOIN_ADV_INFO_RCV_K", label: "광고성 정보 수신 동의(KOR)" },
  { value: "JOIN_ADV_INFO_RCV_G", label: "광고성 정보 수신 동의(GLOBAL)" },
  { value: "JOIN_OST_INFO_K", label: "개인정보 국외이전 동의(KOR)" },
  { value: "JOIN_OST_INFO_G", label: "개인정보 국외이전 동의(GLOBAL)" },
  { value: "JOIN_MKT_INFO_K", label: "마케팅 정보 제공 동의(KOR)" },
  { value: "JOIN_MKT_INFO_G", label: "마케팅 정보 제공 동의(GLOBAL)" }
];

export default function AgreePage() {
  const [agreements, setAgreements] = useState<Agree[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const itemsPerPage = 10;
  const [searchName, setSearchName] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState('');

  useEffect(() => {
    fetchAgreements(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [searchName, selectedPolicy]);

  const fetchAgreements = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/agree?page=${page}&limit=${itemsPerPage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch agreements');
      }
      const data = await response.json();
      setAgreements(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.error('Error fetching agreements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/agree/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cust_nm: searchName, tmcnd_plcy_cls_cd: selectedPolicy }),
      });
      if (!response.ok) {
        throw new Error('Failed to search agreements');
      }
      const data = await response.json();
      setAgreements(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (error) {
      console.error('Error searching agreements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (cust_nm: string, tmcnd_plcy_cls_cd: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Y' ? 'N' : 'Y';
    try {
      await fetch('/api/user/agree', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cust_nm, tmcnd_plcy_cls_cd, agre_yn: newStatus === 'Y' }),
      });
      fetchAgreements(currentPage);
    } catch (error) {
      console.error('Error updating agreement:', error);
    }
  };

  const pageNumbers = [];
  const pageGroupSize = 5;
  const currentGroup = Math.ceil(currentPage / pageGroupSize);
  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePreviousGroup = () => {
    setCurrentPage(Math.max(startPage - pageGroupSize, 1));
  };

  const handleNextGroup = () => {
    setCurrentPage(Math.min(startPage + pageGroupSize, totalPages));
  };

  if (!isAuthenticated) {
    return <div>Please log in to view the agreements.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="사용자명 검색"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          value={selectedPolicy}
          onChange={(e) => setSelectedPolicy(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">약관정책 선택</option>
          {policyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-500 text-white rounded"
        >
          검색
        </button>
      </div>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">사용자 ID</th>
                <th className="py-2">이름</th>
                <th className="py-2">이메일</th>
                <th className="py-2">상태</th>
                <th className="py-2">수정자</th>
                <th className="py-2">수정일자</th>
              </tr>
            </thead>
            <tbody>
              {agreements.map((agree) => (
                <tr key={agree.cust_id}>
                  <td className="py-2">{agree.cust_id}</td>
                  <td className="py-2">{agree.cust_nm}</td>
                  <td className="py-2">{agree.eml}</td>
                  <td className="py-2">
                    <Switch
                      checked={agree.agre_yn === 'Y'}
                      onChange={() => handleToggle(agree.cust_nm, agree.tmcnd_plcy_cls_cd, agree.agre_yn)}
                      className={`${agree.agre_yn === 'Y' ? 'bg-green-500' : 'bg-red-500'} relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span className="sr-only">Toggle Agreement</span>
                      <span
                        className={`${
                          agree.agre_yn === 'Y' ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                  </td>
                  <td className="py-2">{agree.updt_usr_id}</td>
                  <td className="py-2">{new Date(agree.updt_dtm).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-8 flex justify-center items-center space-x-2">
            <button
              onClick={handlePreviousGroup}
              disabled={startPage === 1}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              <ChevronsLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === number ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextGroup}
              disabled={endPage === totalPages}
              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              <ChevronsRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}