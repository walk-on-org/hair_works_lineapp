"use client";

import { useOrientation } from "@/hooks/useOrientation";
import BottomNavigationWithMenu from "@/app/_components/BottomNavigationWithMenu";
import { useRouter } from "next/navigation";

export default function Terms() {
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
          <h1 className="text-lg font-bold text-center">利用規約</h1>
        </div>

        {/* 利用規約 */}
        <div className="px-4 py-6 flex-1 overflow-y-auto">
          <h2 className="text-lg font-bold mb-1">第1条（サービス）</h2>
          <p className="text-sm mb-4 leading-relaxed">
            本サービスとは、本ウェブサイトを通じた、インターネット上の求職・求人、及び、それに関連するサービスを利用目的とするサービスの総称です。
            <br />
            お客様とは、本サービスを利用するすべての者をいいます。
            <br />
            本サービスを利用する者は、本規約の内容をすべて承認したものとみなします。
          </p>
          <p className="text-sm mb-4 leading-relaxed">
            当社は本サービスを提供する際に、お客様が自ら登録した情報または許諾の上でご提供いただいた情報に対し電子メール、ショートメール、ダイレクトメール、郵便、電話等によって当社のサービスのご案内を連絡させていただくことがあります。
          </p>
          <h2 className="text-lg font-bold mt-6 mb-1">第2条（禁止事項）</h2>
          <p className="text-sm mb-4 leading-relaxed">
            お客様は、次の行為をすることはできません。
          </p>
          <ul className="text-sm mb-4 leading-relaxed list-decimal pl-5">
            <li>虚偽の情報を登録し、又は提供すること</li>
            <li>
              当社、他のお客様又は第三者の著作権等知的財産権を侵害する行為
            </li>
            <li>
              当社、他のお客様又は第三者の財産権、プライバシーに関する権利、その他の権利又は利益を侵害する行為
            </li>
            <li>
              本サービスで得た情報を、本サービスの利用目的の範囲を超えて第三者に譲渡し、又は営利を目的とした情報提供活動に用いること
            </li>
            <li>
              コンピューター・ウィルスその他の有害なコンピューター・プログラムを含む情報を送信する行為
            </li>
            <li>本サービスの運営の妨げとなる一切の行為</li>
            <li>本サービスを利用する他のお客様又は第三者を誹謗中傷する行為</li>
            <li>公序良俗に反する行為</li>
            <li>法令に反する一切の行為</li>
            <li>その他、当社が不適切と判断する一切の行為</li>
          </ul>
          <h2 className="text-lg font-bold mt-6 mb-1">第3条（お客様の責任）</h2>
          <p className="text-sm mb-4 leading-relaxed">
            お客様は自らの意思によって本サービスを利用するものとします。
            <br />
            お客様は、お客様が自ら登録した情報については、その内容について一切の責任を負うものとします。
            <br />
            前項の登録情報は、本サービスを利用するために必要な範囲内で、お客様自らがいつでも変更、追加、削除できるものとし、常にお客様が責任をもって利用目的に沿い、正確、最新に保つものとします。
          </p>
          <h2 className="text-lg font-bold mt-6 mb-1">第4条（情報の削除）</h2>
          <p className="text-sm mb-4 leading-relaxed">
            当社は、お客様による情報の送信、提供等の行為が本規約第2条に規定された行為に該当し又はそのおそれがある場合には、お客様に通知することなく、当該情報の全部又は一部について、削除、送信停止その他必要と認める措置を講じることができます。
          </p>
          <p className="text-sm mb-4 leading-relaxed">
            当社は、お客様が第2条その他本規約の規定に違反した場合には、お客様に通知することなく、当該お客様について本サービスの利用を一時的に停止し、又はお客様としての登録を抹消することができます。
          </p>
          <h2 className="text-lg font-bold mt-6 mb-1">
            第5条（提供情報の利用）
          </h2>
          <p className="text-sm mb-4 leading-relaxed">
            お客様は、本サービスにおいて提供した情報のうち、氏名、住所、電話番号、メールアドレス等個人を特定する情報を除く情報*を、当社が日本の国内外で無償で非独占的に使用する（複製、公開、送信、頒布、譲渡、貸与、翻訳、翻案を含む）権利を許諾（サブライセンス権を含む）したものとみなします。また、お客様は著作者人格権を行使しないものとします。
          </p>
          <p className="text-sm mb-4 leading-relaxed">
            *「個人を特定する情報」とは、氏名、住所、電話番号、電子メールアドレスなどの個人を特定することが可能な情報および、複数の情報を組み合わせることで個人を特定することが可能な情報をいいます。具体的には、住所を利用する際には都道府県名と地方名までは「個人を特定することができない情報」として取り扱います。
            <br />
            また年齢そのものは、複数の情報を組み合わせることで「個人を特定する情報」とみなし、5〜10歳きざみの年齢層を「個人を特定することができない情報」として取り扱います。
          </p>
          <h2 className="text-lg font-bold mt-6 mb-1">
            第6条（サービス内容の変更）
          </h2>
          <p className="text-sm mb-4 leading-relaxed">
            当社は、本サービスの運営を良好に保つため、事前の通知なく、本サービスの内容を変更することがあり、お客様はそれに対して異議を申し立てないものとします。
          </p>
          <h2 className="text-lg font-bold mt-6 mb-1">
            第7条（サービスの停止・終了等）
          </h2>
          <p className="text-sm mb-4 leading-relaxed">
            当社は、以下のいずれかに該当する事由が発生した場合、お客様への事前の通知及び承諾を要することなく、本サービスを停止または終了することができます。
          </p>
          <ul className="text-sm mb-4 leading-relaxed list-decimal pl-5">
            <li>
              本サービス運営のためのシステム（以下「システム」という。）の保守、更新等を定期的又は緊急に行う場合
            </li>
            <li>
              通常講ずるべきウィルス対策では防止できないウィルス被害、火災、停電、天災地変などの不可抗力により、本サービスの提供が困難な場合
            </li>
            <li>突発的なシステムの故障等が発生した場合</li>
            <li>
              その他、不測の事態により、当社が本サービスの提供が困難と判断した場合
            </li>
          </ul>
          <h2 className="text-lg font-bold mt-6 mb-1">
            第8条（お客様による登録の削除）
          </h2>
          <p className="text-sm mb-4 leading-relaxed">
            お客様は、自らの意思により本サービスへの登録を削除することができます。
          </p>
          <h2 className="text-lg font-bold mt-6 mb-1">第9条（免責）</h2>
          <p className="text-sm mb-4 leading-relaxed">
            当社は、企業情報等の第三者の情報、広告その他第三者により提供される情報、お客様等が本サービスに登録し掲載する情報等に関し、内容の正確性、有用性等について何らの保証もしません。
            <br />
            お客様の本サービスへの登録及び本サービスの利用(第三者の情報提供行為等を含む)から生じる一切の損害に関して、当社は責任を負わないものとします。
            <br />
            当社は、当社による本サービスの提供の中断、停止、利用不能又は変更、お客様の情報の削除又は消失､お客様の登録の抹消、本サービスの利用によるデータの消失又は機器の故障若しくは損傷、その他本サービスに関連してお客様が被った損害につき、一切責任を負わないものとします。
            <br />
            本ウェブサイトから他のウェブサイトへのリンク又は他のウェブサイトから本ウェブサイトへのリンクが提供されている場合でも、当社は、本ウェブサイト以外のウェブサイト及びそこから得られる情報に関して如何なる理由に基づいても一切の責任を負わないものとします。
            <br />
            当社は、お客様による本サービスの利用によって、就職・転職が成功することを保証するものではありません。
            <br />
            当社の責任を免責する本規約の条項が消費者契約法等の法令に反することによって無効となる場合など、何らかの理由によって当社が本サービスに関してお客様に対して損害賠償責任を負うべき場合でも、当社の賠償責任は、故意または重過失による場合を除き、お客様に生じた直接かつ通常の損害の範囲に限るものとします。
          </p>
          <h2 className="text-lg font-bold mt-6 mb-1">第10条（規約の変更）</h2>
          <p className="text-sm mb-4 leading-relaxed">
            当社は、お客様の承諾を得ることなく、本規約を随時変更することができます。
            <br />
            変更の内容は、本ウェブサイト上に2週間掲載し、その期間経過をもってすべてのお客様が了承したものとみなします。
          </p>
          <h2 className="text-lg font-bold mt-6 mb-1">
            第11条（本規約の譲渡等）
          </h2>
          <p className="text-sm mb-4 leading-relaxed">
            お客様は、当社の書面による事前の承諾なく、本規約に基づく権利又は義務につき、第三者に対し、譲渡、移転、担保設定、その他の処分をすることはできません。
            <br />
            当社は本サービスにかかる事業を他社に譲渡した場合には、当該事業譲渡に伴い本規約に基づく権利及び義務並びにお客様の登録事項その他の顧客情報を当該事業譲渡の譲受人に譲渡することができるものとし、お客様は、かかる譲渡につき本項において予め同意したものとします。
            <br />
            なお、本項に定める事業譲渡には、通常の事業譲渡のみならず、会社分割その他事業が移転するあらゆる場合を含むものとします。
          </p>
          <h2 className="text-lg font-bold mt-6 mb-1">
            第12条（お客様の損害賠償義務）
          </h2>
          <p className="text-sm mb-4 leading-relaxed">
            お客様が本規約に違反し、当社に対し損害を与えた場合、お客様は当社に対し、損害賠償義務を負担します。
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
