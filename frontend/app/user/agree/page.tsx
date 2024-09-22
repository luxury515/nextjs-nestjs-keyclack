'use client'

import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react"
import { useAuth } from '../../contexts/AuthContext'
import { Agree } from '@/types'

const ITEMS_PER_PAGE = 10

const policyOptions = [
  { value: "ALL", label: "전체" },
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
      const response = await fetch(`/api/user/agree?page=${page}&limit=${ITEMS_PER_PAGE}`);
      if (!response.ok) {
        throw new Error('Failed to fetch agreements');
      }
      const data = await response.json();
      setAgreements(data);
      setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
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
      setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
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

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => setCurrentPage(i)}
          variant={currentPage === i ? "secondary" : "outline"}
          size="sm"
        >
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  if (!isAuthenticated) {
    return <div>Please log in to view the agreements.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">사용자 정보 수집 동의 관리</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          placeholder="이름으로 검색"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={selectedPolicy} onValueChange={setSelectedPolicy}>
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="정책 종류 선택" />
          </SelectTrigger>
          <SelectContent>
            {policyOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} className="md:w-1/3">
          <Search className="mr-2 h-4 w-4" /> 검색
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자 ID</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>수정자</TableHead>
                <TableHead>수정일자</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agreements.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((agree: Agree) => (
                <TableRow key={agree.cust_id}>
                  <TableCell>{agree.cust_id}</TableCell>
                  <TableCell>{agree.cust_nm}</TableCell>
                  <TableCell>{agree.eml}</TableCell>
                  <TableCell>
                    <Switch
                      checked={agree.agre_yn === 'Y'}
                      onChange={() => handleToggle(agree.cust_nm, agree.tmcnd_plcy_cls_cd, agree.agre_yn)}
                      className={`${
                        agree.agre_yn === 'Y' ? 'bg-green-500' : 'bg-red-500'
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span className="sr-only">Toggle Agreement</span>
                      <span
                        className={`${
                          agree.agre_yn === 'Y' ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                  </TableCell>
                  <TableCell>{agree.updt_usr_id}</TableCell>
                  <TableCell>{new Date(agree.updt_dtm).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-8 flex justify-center items-center space-x-2">
            <Button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              size="sm"
              variant="outline"
            >
              <ChevronsLeft className="h-4 w-4" />
              처음
            </Button>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 5, 1))}
              disabled={currentPage === 1}
              size="sm"
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4" />
              이전
            </Button>

            {renderPageNumbers()}

            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 5, totalPages))}
              disabled={currentPage === totalPages}
              size="sm"
              variant="outline"
            >
              다음
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              size="sm"
              variant="outline"
            >
              마지막
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}