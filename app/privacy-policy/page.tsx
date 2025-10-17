"use client";

import { useOrientation } from "@/hooks/useOrientation";
import BottomNavigationWithMenu from "@/app/_components/BottomNavigationWithMenu";
import { useRouter } from "next/navigation";

export default function PrivacyPolicy() {
  const isLandscape = useOrientation();
  const router = useRouter();

  // ホームボタンのクリック処理
  const handleHomeClick = () => {
    router.push("/");
  };

  return (
    <main
      className={`h-dvh bg-white text-gray-900 ${
        isLandscape ? "pb-[22px] px-[44px]" : "pb-[34px]"
      }`}
    >
      <div className="w-full mx-auto flex flex-col h-full">
        {/* ヘッダー */}
        <div className="px-6 py-4 bg-[url(/title_background_watercolor_pattern01.jpg)]">
          <h1 className="text-lg font-bold text-center">
            プライバシーポリシー
          </h1>
        </div>

        {/* プライバシーポリシー */}
        <div className="px-4 py-6 flex-1 overflow-y-auto">
          <p className="text-sm mb-4 leading-relaxed">
            株式会社walk-on（以下「当社」）は、以下のとおり個人情報保護方針を定め、個人情報保護の仕組みを構築し、全従業員に個人情報保護の重要性の認識と取組みを徹底させることにより、個人情報の保護を推進致します。
          </p>
          <h2 className="text-lg font-bold mt-6 mb-1">▼個人情報の管理</h2>
          <p className="text-sm mb-4 leading-relaxed">
            当社は、お客さまの個人情報を正確かつ最新の状態に保ち、個人情報への不正アクセス・紛失・破損・改ざん・漏洩などを防止するため、セキュリティシステムの維持・管理体制の整備・社員教育の徹底等の必要な措置を講じ、安全対策を実施し個人情報の厳重な管理を行ないます。
          </p>
          <p className="text-sm mb-4 leading-relaxed">
            また、取得した個人情報は、お客様ご本人に通知するか、もしくは弊社インターネットホームページに公表した利用目的の範囲内において利用します。
          </p>
          <h2 className="text-lg font-bold mt-6 mb-1">▼個人情報の利用目的</h2>
          <p className="text-sm mb-4 leading-relaxed">
            お客さまからお預かりした個人情報は、当社からのご連絡や業務のご案内やご質問に対する回答として、電子メールや資料のご送付に利用いたします。
          </p>
          <p className="text-sm mb-4 leading-relaxed">
            また、求人情報に関するメールマガジンを配信するために使用します。
          </p>
          <h2 className="text-lg font-bold mt-6 mb-1">
            ▼個人情報の第三者への開示・提供の禁止
          </h2>
          <p className="text-sm mb-4 leading-relaxed">
            当社は、お客さまの同意を得ず、法令に反しない範囲で、個人情報を第三者に提供しません。ただし、次の場合は除きます。
          </p>
          <ul className="text-sm mb-4 leading-relaxed list-decimal pl-5">
            <li>あらかじめ本人の同意を得た場合</li>
            <li>個人情報保護法の定める例外に当たる場合</li>
            <li>
              求人者に対する次の情報提供
              <dl className="my-1">
                <dt>①提供先</dt>
                <dd className="mb-1">弊社と契約関係にある求人者</dd>
                <dt>②提供する情報</dt>
                <dd className="mb-1">
                  氏名・メールアドレス・希望転職条件・生まれ年・電話番号・住所など本サービス利用にあたり登録した情報
                </dd>
                <dt>③提供方法</dt>
                <dd className="mb-1">電子メールその他の電磁気方法</dd>
                <dt>④提供先における情報利用目的</dt>
                <dd className="mb-1">求人にかかる人材採用の検討と実施</dd>
              </dl>
            </li>
            <li>
              広告配信事業者に対する次の情報提供
              <dl className="my-1">
                <dt>①提供先</dt>
                <dd className="mb-1">広告配信事業者</dd>
                <dt>②提供する情報</dt>
                <dd className="mb-1">電子メールアドレス、およびクッキー情報</dd>
                <dt>③提供方法</dt>
                <dd className="mb-1">電子メールその他の電磁気方法</dd>
                <dt>④提供先における情報利用目的</dt>
                <dd className="mb-1">本サービスに関する広告配信</dd>
              </dl>
            </li>
          </ul>
          <h2 className="text-lg font-bold mt-6 mb-1">▼クッキーの取扱い</h2>
          <p className="text-sm mb-4 leading-relaxed">
            本ウェブサイト（弊社のウェブサイトを指します。以下同じ。）では、クッキーを利用しています。
            <br />
            クッキーとは、利用者の本ウェブサイト閲覧情報・利用履歴等（本方針上「クッキー情報」といいます）を、ウェブブラウザを通じ利用者のコンピューターに送信し、保存しておく仕組みです。
          </p>
          <p className="text-sm mb-4 leading-relaxed">
            クッキーの利用は、各利用者のパソコンにより拒否設定することができます。
            <br />
            ただし、クッキーの利用を拒否した場合、
            本ウェブサイトの一部が適切に機能しなくなる場合がありますので、予めご了承ください。
          </p>
          <h2 className="text-lg font-bold mt-6 mb-1">
            ▼お客さまの同意がある場合
          </h2>
          <p className="text-sm mb-4 leading-relaxed">
            お客さまが希望されるサービスを行なうために当社が業務を委託する業者に対して開示する場合
            <br />
            法令に基づき開示することが必要である場合
            <br />
            個人情報の安全対策
            <br />
            当社は、個人情報の正確性及び安全性確保のために、セキュリティに万全の対策を講じています。
          </p>
          <h2 className="text-lg font-bold mt-6 mb-1">▼ご本人の照会</h2>
          <p className="text-sm mb-4 leading-relaxed">
            お客さまがご本人の個人情報の照会・修正・削除などをご希望される場合には、ご本人であることを確認の上、対応させていただきます。
          </p>
          <h2 className="text-lg font-bold mt-6 mb-1">
            ▼法令、規範の遵守と見直し
          </h2>
          <p className="text-sm mb-4 leading-relaxed">
            当社は、保有する個人情報に関して適用される日本の法令、その他規範を遵守するとともに、本ポリシーの内容を適宜見直し、その改善に努めます。
          </p>
        </div>

        {/* 下部ナビゲーション */}
        <BottomNavigationWithMenu
          onHomeClick={handleHomeClick}
          onLogout={() => {}}
          showLogout={false}
        />
      </div>
    </main>
  );
}
