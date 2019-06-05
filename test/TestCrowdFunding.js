let CrowdFunding = artifacts.require("./testCrowdFunding")

contract('testCrowdFunding',function(accounts){
	let contract;
	let contractCreator = accounts[0];
	let beneficiary = accounts[1];

	const ONE_ETH = 1000000000000000000;
	const ERROR_MSG = 'Returned error: VM Exception while processing transaction: revert time over -- Reason given: time over.';
	const ONGOING = '0';
	const FAILED = '1';
	const SUCCEEDED = '2';
	const PAID_OUT = '3';

	beforeEach(async function(){
		contract = await CrowdFunding.new(
			'funding',
			1,
			10,
			beneficiary,
			{
				from : contractCreator,
				gas: 2000000
			}
		);
	});

	it('Contract initialized' , async function(){
		let campaignName = await contract.name.call()
		expect(campaignName).to.equal('funding');
	});

	it('contribution',async function(){
		await contract.contribute({
			value: ONE_ETH,
			from: contractCreator
		});

		let campaignName = await contract.check.call()
		expect(campaignName).to.equal('check');	});

	it('after deadline',async function(){
		fundingDeadline = await contract.fundingDeadline.call();
		await contract.setCurrentTime(601);

		try{
			await contract.contribute({
			value: ONE_ETH,
			from: contractCreator
				});
				expect.fail();
		}
		catch(error){
			expect(error.message).to.equal(ERROR_MSG);
		}
	});

	it('CrowdFunding succeeded',async function(){
		await contract.contribute({
			value: ONE_ETH,
			from: contractCreator
				});
		await contract.setCurrentTime(601);
		await contract.finishCrowdFunding();

		let status = await contract.state.call();

		expect(status.toString()).to.equal(SUCCEEDED);
	});

	it('CrowdFunding failed',async function(){
		await contract.setCurrentTime(601);
		await contract.finishCrowdFunding();

		let status = await contract.state.call();

		expect(status.toString()).to.equal(FAILED);
	});

	it('Paid out',async function(){
		await contract.contribute({
			value: ONE_ETH,
			from: contractCreator
				});
		await contract.setCurrentTime(601);
		await contract.finishCrowdFunding();

		let initAmount = await web3.eth.getBalance(beneficiary);
		await contract.collect();

		let finalAmount = await web3.eth.getBalance(beneficiary);
		expect(finalAmount-initAmount).to.equal(ONE_ETH);

		let status = await contract.state.call();

		expect(status.toString()).to.equal(PAID_OUT);
	});

	it('Withdraw money',async function(){
		await contract.contribute({
			value: ONE_ETH-100,
			from: contractCreator
				});
		await contract.setCurrentTime(601);
		await contract.finishCrowdFunding();

		await contract.withdraw({from: contractCreator});
		amount = await contract.amounts.call(contractCreator);
		expect(amount.toString()).to.equal('0');

		let status = await contract.state.call();

		expect(status.toString()).to.equal(FAILED);
	});

	it('event emit',async function(){
		let watcher = contract.campaignEvent();

		await contract.setCurrentTime(601);
		await contract.finishCrowdFunding();

		let events = await watcher.get();

		let event = events[0];
		expect(event.args.totalCollected.toNumber()).to.equal(0);
		expect(event.args.succesful).to.equal(false);
	});
});