'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const [searchName, setSearchName] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [searchParams, setSearchParams] = useState({ cust_nm: '', tmcnd_plcy_cls_cd: '' });

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/agree/search?pageSize=${ITEMS_PER_PAGE}&page=${currentPage}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });
      if (!response.ok) {
        throw new Error('Failed to search agreements');
      }
      const { data, total } = await response.json();
      setAgreements(data);
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error searching agreements:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchParams]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setSearchName(newName);
    setSearchParams(prev => ({ ...prev, cust_nm: newName }));
  };

  const handlePolicyChange = (value: string) => {
    setSelectedPolicy(value);
    setSearchParams(prev => ({ ...prev, tmcnd_plcy_cls_cd: value }));
  };

  const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleToggle = async (cust_nm: string, tmcnd_plcy_cls_cd: string, currentStatus: string) => {
    alert(cust_nm + " " + tmcnd_plcy_cls_cd + " " + currentStatus);
    const newStatus = currentStatus === 'Y' ? 'N' : 'Y';
    try {
      await fetch('/api/user/agree', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cust_nm, tmcnd_plcy_cls_cd, agre_yn: newStatus === 'Y' }),
      });
      handleSearch();
    } catch (error) {
      console.error('Error updating agreement:', error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

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
    <div className="container mx-auto p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">사용자 정보 수집 동의 관리</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          placeholder="이름으로 검색"
          value={searchName}
          onChange={handleNameChange}
          onKeyDown={handleKeyPress} // 수정된 부분
          className="md:w-1/4"
        />
        <Select value={selectedPolicy} onValueChange={handlePolicyChange}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="선택" />
          </SelectTrigger>
          <SelectContent>
            {policyOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} className="md:w-1/8">
          <Search className="mr-2 h-4 w-4" /> 검색
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자 ID</TableHead>
                <TableHead>정책</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>수정자</TableHead>
                <TableHead>수정일자</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agreements.map((agree: Agree) => (
                <TableRow key={agree.cust_id}>
                  <TableCell>{agree.cust_id}</TableCell>
                  <TableCell>{agree.tmcnd_plcy_cls_cd}</TableCell>
                  <TableCell>{agree.cust_nm}</TableCell>
                  <TableCell>{agree.eml}</TableCell>
                  <TableCell>
                    <Switch
                      checked={agree.agre_yn === 'Y'}
                      onCheckedChange={() => handleToggle(agree.cust_nm, agree.tmcnd_plcy_cls_cd, agree.agre_yn)}
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