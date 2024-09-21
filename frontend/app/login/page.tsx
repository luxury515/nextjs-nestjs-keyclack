'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon, UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const { login } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await login(username, password);
			router.push('/'); // 로그인 성공 후 리다이렉트
		} catch (error) {
			console.error('Login failed:', error);
			// 에러 처리 (예: 사용자에게 알림 표시)
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<div className="flex justify-center">
					<div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
						<LockIcon className="h-10 w-10 text-white" />
					</div>
				</div>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					CMS 관리자 로그인
				</h2>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<Label htmlFor="username">사용자 이름</Label>
							<div className="mt-1 relative rounded-md shadow-sm">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
								</div>
								<Input
									id="username"
									name="username"
									type="text"
									autoComplete="username"
									required
									className="pl-10"
									placeholder="사용자 이름"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
								/>
							</div>
						</div>

						<div>
							<Label htmlFor="password">비밀번호</Label>
							<div className="mt-1 relative rounded-md shadow-sm">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<LockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
								</div>
								<Input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="pl-10"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</div>

						<div>
							<Button type="submit" className="w-full">
								로그인
							</Button>
						</div>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							{/* <div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									또는
								</span>
							</div> */}
						</div>

						{/* <div className="mt-6 text-center">
							<a href="#" className="font-medium text-primary hover:text-primary-dark">
								비밀번호를 잊으셨나요?
							</a>
						</div> */}
					</div>
				</div>
			</div>
		</div>
	);
}