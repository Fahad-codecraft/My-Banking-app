declare type User = {
  $id: string;
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  name: string;
};

declare type getUserInfoProps = {
  userId: string;
};


declare type SignUpParams = {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  email: string;
  password: string;
};

declare type signInProps = {
  email: string;
  password: string;
};

declare interface createBankAccountProps {
  userId: string;
  accountId: string;
}

declare interface SiderbarProps {
  user: User;
}

declare interface FooterProps {
  user: User;
  type?: 'mobile' | 'desktop';
}

declare interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
}

declare interface getAccountProps {
  userId: string;
}

declare interface getBankProps {
  userId: string;
}

declare interface getBankByAccountIdProps {
  accountId: string;
}

declare interface TotalBalanceBoxProps{
  totalCurrentBalance: number;
  // accountId: [] | string;
}

declare interface getMoneyProps{
  userId: string;
}

declare interface CategoryBadgeProps {
  category: string;
}

declare type Transaction = {
  id: string;
  $id: string;
  name: string;
  accountId: string;
  amount: number;
  category: string;
  type: string;
  $createdAt: string;
  senderAccount: string;
  receiverAccount: string;
  receiverEmail: string;
};

declare interface TransactionTableProps {
  transactions: Transaction[];
} 

declare interface RecentTransactionsProps {
  transactions: Transaction[];
  userId: string;
}

declare interface CreateTransactionProps {
  type: string;
  amount: string;
  senderAccount: string;
  senderEmail: string;
  receiverAccount: string;
  receiverEmail: string;
  senderUserId?: string;
  receiverUserId?: string;
  category: string;
}

declare interface TransferProps {
  name: string;
  senderEmail: string;
  receiverEmail: string;
  // senderAccount: string;
  // receiverAccount: string;
  amount: string;
}

declare interface AccountIdProps {
  accountId: string;
}

declare interface createLoanProps {
  principalAmount: string;
  time: string;
  intrestRate: string;
  repayAmount: string;
  remainingAmount: string;
  accountId: string;
  reason: string;
}

declare type LoanProps = {
  id:string;
  $id: string;
  principalAmount: string;
  remainingAmount: string;
  intrestRate: string;
  time: string;
  $createdAt: string;
  reason: string;
}

declare interface LoansTableProps {
  Loans: LoanProps[];
}

declare interface LoanDropdownProps {
    loans: LoanProps[];
    setValue?: UseFormSetValue<any>;
    otherStyles?: string;
}

declare interface LoanRepayProp {
  email: string;
  loanReason: string;
  repayAmount: string;
}

declare interface loanFindProp {
  remainingAmount: string;
}


declare interface PaginationProps {
  page: number
  totalPages: number
}

declare interface MobileNavProps {
  user: User;
}