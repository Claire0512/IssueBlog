import getTimeDifference from '@/src/lib/getTimeDifference';

function IssueHeader({
	username,
	createdAt,
	canEdit = false,
	handleEditClick = () => {},
}: {
	username: string;
	createdAt: string;
	canEdit?: boolean;
	handleEditClick?: () => void;
}) {
	return (
		<div className="flex w-full flex-1 items-center justify-between rounded-t-lg bg-[#fac23e80] p-2">
			<div className="item-center flex  ">
				<p className="ml-4 text-left font-bold text-black">{username}</p>
				<div className="ml-4 flex items-center justify-center text-left text-sm text-gray-500">
					{getTimeDifference(createdAt)}
				</div>
			</div>
			{canEdit && (
				<button
					onClick={handleEditClick}
					className="pe-4 text-right font-semibold text-gray-800"
				>
					Edit
				</button>
			)}
		</div>
	);
}

export default IssueHeader;
